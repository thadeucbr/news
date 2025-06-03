// src/services/openaiService.js
// Serviço para interagir com a API da OpenAI e gerar conteúdos

const axios = require('axios');
const { logger } = require('../utils/logger');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = "gpt-4o-mini";

async function callOpenAI_API(messages, jsonMode = false) {
    if (!OPENAI_API_KEY) {
        logger.warn("Chave da API da OpenAI (OPENAI_API_KEY) não configurada. Usando respostas mockadas.");
        if (messages.some(m => m.content.includes("identifique as 5 notícias mais impactantes"))) {
            return {
                top_news: [
                    { title: "OpenAI Mock: IA Incrível", summary: "Nova IA da OpenAI faz maravilhas.", impact_reason: "Mercado em polvorosa." },
                    { title: "OpenAI Mock: Dev Framework", summary: "Framework JS com novas features.", impact_reason: "Devs mais felizes." },
                ]
            };
        } else if (messages.some(m => m.content.includes("escreva um artigo para o LinkedIn"))) {
            return "## Artigo LinkedIn (OpenAI Mock)\n\nAs notícias da OpenAI são demais!\n\n1. **OpenAI Mock: IA Incrível**: Fazendo coisas...\n...";
        } else if (messages.some(m => m.content.includes("crie um roteiro para um YouTube Short"))) {
            return "### Roteiro YouTube Short (OpenAI Mock)\n\n**Intro:** OpenAI NEWS!\n**Notícia 1:** IA Incrível da OpenAI!\n...";
        }
        return "Resposta mockada da OpenAI.";
    }
    const payload = {
        model: OPENAI_MODEL,
        messages: messages,
    };
    if (jsonMode) {
        payload.response_format = { type: "json_object" };
    }
    try {
        const response = await axios.post(OPENAI_API_URL, payload, {
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            timeout: 60000
        });
        if (response.data && response.data.choices && response.data.choices.length > 0) {
            const messageContent = response.data.choices[0].message.content;
            if (jsonMode) {
                try {
                    return JSON.parse(messageContent);
                } catch (e) {
                    logger.error("Erro ao parsear JSON da OpenAI:", e);
                    logger.error("Resposta recebida (texto):", messageContent);
                    throw new Error("Resposta da OpenAI não é um JSON válido, mesmo com json_object mode.");
                }
            }
            return messageContent;
        } else {
            logger.error("Resposta inesperada da API OpenAI:", JSON.stringify(response.data, null, 2));
            throw new Error("Estrutura de resposta inesperada da API OpenAI.");
        }
    } catch (error) {
        if (error.response) {
            logger.error("Erro ao chamar a API OpenAI:", error.response.status, error.response.data ? JSON.stringify(error.response.data) : 'No response data');
        } else {
            logger.error("Erro ao chamar a API OpenAI:", error.message);
        }
        if (error.response && error.response.status === 401) {
            logger.error("Erro 401: Verifique sua OPENAI_API_KEY. Pode estar inválida ou sem créditos.");
        }
        if (error.response && error.response.status === 429) {
            logger.error("Erro 429: Rate limit atingido na API da OpenAI. Tente novamente mais tarde ou verifique seus limites.");
        }
        throw error;
    }
}

async function getTop5ImpactfulNews(newsItems) {
    logger.info("Analisando notícias com OpenAI para selecionar as mais impactantes...");
    if (!newsItems || newsItems.length === 0) {
        logger.info("Nenhuma notícia fornecida para análise.");
        return [];
    }
    const newsForPrompt = newsItems.map(n => `- Título: ${n.title}\n  Fonte: ${n.source}\n  Data: ${n.date}\n  Link: ${n.link}\n  Resumo Coletado: ${n.summary}`).join("\n\n---\n\n");
    const systemPrompt = `Você é um analista de mercado experiente, especializado em Inteligência Artificial e Desenvolvimento de Software. Sua tarefa é identificar as notícias mais impactantes.`;
    const userPrompt = `\n        Analise a seguinte lista de notícias recentes (da última semana):\n        ${newsForPrompt}\n\n        Com base na sua análise crítica, identifique até 5 (cinco) notícias que você considera as MAIS IMPACTANTES para o mercado e para profissionais da área.\n        Para cada notícia selecionada, forneça:\n        1. O título original da notícia.\n        2. Um breve resumo (1-2 frases concisas) DO CONTEÚDO PRINCIPAL da notícia, elaborado por você.\n        3. Uma justificativa clara e concisa do porquê ela é impactante (ex: potencial de disrupção no mercado, avanço tecnológico significativo, implicações éticas amplas, grande número de desenvolvedores ou empresas afetadas, mudança de paradigma, etc.).\n\n        Priorize notícias com impacto direto e tangível. Evite notícias muito especulativas ou com baixo impacto prático imediato.\n        Se não houver 5 notícias claramente impactantes, retorne menos de 5, mas apenas aquelas que realmente se destacam. Se nenhuma notícia for considerada impactante, retorne uma lista vazia.\n\n        A resposta DEVE ser um objeto JSON contendo uma única chave \"top_news\", que é um array de objetos. Cada objeto deve ter as chaves \"title\", \"summary\", e \"impact_reason\".\n        Exemplo de formato de saída:\n        {\n          \"top_news\": [\n            {\n              \"title\": \"Título da Notícia 1\",\n              \"summary\": \"Resumo elaborado da notícia 1.\",\n              \"impact_reason\": \"Justificativa do impacto da notícia 1.\"\n            }\n          ]\n        }\n    `;
    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
    ];
    try {
        const result = await callOpenAI_API(messages, true);
        return result.top_news || [];
    } catch (error) {
        logger.error("Erro ao obter as top 5 notícias da OpenAI:", error.message);
        return [];
    }
}

async function generateLinkedInArticle(topNews) {
    logger.info("Gerando artigo para o LinkedIn com OpenAI...");
    if (!topNews || topNews.length === 0) {
        return "Não foi possível gerar o artigo do LinkedIn: nenhuma notícia impactante fornecida.";
    }
    const newsForPrompt = topNews.map((n, index) =>
        `${index + 1}. **${n.title}**\n   *Destaque (Resumo da IA):* ${n.summary}\n   *Por que é Importante (Análise da IA):* ${n.impact_reason}`
    ).join("\n\n");
    const systemPrompt = `Você é um copywriter sênior e especialista em marketing de conteúdo para o LinkedIn, com foco em tecnologia (Inteligência Artificial e Desenvolvimento de Software). Sua tarefa é criar um artigo envolvente.`;
    const userPrompt = `\n        Com base nas ${topNews.length} notícias mais impactantes da semana, já analisadas e resumidas pela IA (conforme abaixo), escreva um artigo otimizado para o LinkedIn.\n\n        Notícias Selecionadas e Analisadas pela IA:\n        ${newsForPrompt}\n\n        Instruções para o artigo do LinkedIn:\n        - **Título:** Crie um título magnético e profissional que gere curiosidade (ex: \"IA e Dev: As ${topNews.length} Novidades da Semana Que Você Não Pode Perder\" ou \"Transformações em IA e Software: Top ${topNews.length} Destaques da Semana\").\n        - **Introdução:** Um parágrafo curto e envolvente que apresente o valor do artigo e convide à leitura.\n        - **Corpo do Artigo:** Para cada uma das ${topNews.length} notícias:\n            - Use o título da notícia como um subtítulo (H2 ou H3 em Markdown, ex: ## Título da Notícia).\n            - Apresente o \"Destaque (Resumo da IA)\".\n            - Explique \"Por que é Importante (Análise da IA)\".\n            - Adicione um breve comentário ou insight seu (1-2 frases) para agregar valor e perspectiva humana.\n        - **Conclusão:** Um parágrafo final que reforce a importância de se manter atualizado e incentive o engajamento.\n        - **Call to Action:** Faça uma pergunta aberta para estimular comentários (ex: \"Qual dessas novidades mais te surpreendeu ou vai impactar seu trabalho? Compartilhe sua opinião nos comentários!\").\n        - **Hashtags:** Inclua 5-7 hashtags relevantes e estratégicas (ex: #InteligenciaArtificial #DesenvolvimentoDeSoftware #InovacaoTecnologica #MercadoDeTI #TransformacaoDigital #FuturoDoTrabalho #NoticiasTech).\n        - **Tom:** Profissional, informativo, mas também acessível e que inspire confiança.\n        - **Formato:** Use Markdown para excelente legibilidade.\n    `;
    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
    ];
    try {
        return await callOpenAI_API(messages);
    } catch (error) {
        logger.error("Erro ao gerar artigo do LinkedIn com OpenAI:", error.message);
        return "Erro ao gerar artigo do LinkedIn com OpenAI.";
    }
}

async function generateYouTubeShortScript(topNews) {
    logger.info("Gerando roteiro para YouTube Short com OpenAI...");
    if (!topNews || topNews.length === 0) {
        return "Não foi possível gerar o roteiro do YouTube Short: nenhuma notícia impactante fornecida.";
    }
    const newsForPrompt = topNews.map((n, index) =>
        `Notícia ${index + 1}: \"${n.title}\" (Essência pela IA: ${n.summary} Impacto Principal pela IA: ${n.impact_reason})`
    ).join("\n");
    const systemPrompt = `Você é um roteirista de vídeos curtos virais, especializado em conteúdo de tecnologia para YouTube Shorts e TikTok. Crie roteiros dinâmicos e concisos.`;
    const userPrompt = `\n        Crie um roteiro dinâmico e super conciso para um YouTube Short (máximo 58 segundos) apresentando as ${topNews.length} notícias mais impactantes da semana sobre Inteligência Artificial e Desenvolvimento de Software, com base nas análises da IA fornecidas.\n\n        Notícias Selecionadas e Analisadas pela IA:\n        ${newsForPrompt}\n\n        Instruções para o Roteiro do Short:\n        - **Objetivo:** Informar rapidamente e gerar máxima curiosidade.\n        - **Duração Total:** Máximo 58 segundos. Ajuste o tempo por notícia conforme o número de notícias (ex: ${topNews.length === 1 ? '45s' : topNews.length === 2 ? '20-22s' : topNews.length === 3 ? '13-15s' : '8-10s'} por notícia), mantendo-o dinâmico.\n        - **Estrutura Sugerida:**\n            1.  **Gancho Rápido (2-4s):** Título chamativo na tela + voz enérgica. Ex: \"TOP ${topNews.length} IA & DEV NEWS QUE SACUDIRAM A SEMANA!\" ou \"ALERTA TECH! 💥 ${topNews.length} Novidades de IA e Dev que VOCÊ PRECISA SABER!\"\n            2.  **Apresentação das Notícias:** Para cada notícia, mencione o título ou a essência e seu impacto principal de forma BEM DIRETA e ENÉRGICA.\n            3.  **Call to Action Final (3-5s):** Ex: \"Qual te deixou de queixo caído? 🤯 Comenta aqui! Não esquece de seguir pra mais bomba tech!\"\n        - **Linguagem:** Super informal, rápida, com gírias atuais (se apropriado ao público), como se estivesse contando uma fofoca quente para amigos. Use palavras de impacto e emojis no roteiro para sugerir o tom.\n        - **Visualizações (Sugestões):** Para cada notícia, sugira MUITO brevemente um elemento visual que poderia aparecer (ícone animado, trecho de código estilizado, gráfico simples e chamativo, logo da empresa mencionada).\n        - **Formato do Roteiro:**\n            TEMPO ESTIMADO | AÇÃO/VOZ DO APRESENTADOR(A) | SUGESTÃO VISUAL NA TELA\n            (Exemplo para ${topNews.length} notícias)\n            0-3s  | APRESENTADOR(A) (Voz Alta, Rápida, Empolgada): \"SEMANA EXPLODIU NO MUNDO TECH! 💣 TOP ${topNews.length} de IA e DEV que vão te deixar CHOCADO(A)!\" | Texto: \"TOP ${topNews.length} NEWS DA SEMANA!\", Efeitos de explosão, emojis 💥🔥.\n            (tempo da notícia 1) | APRESENTADOR(A): \"Primeiríssima: [Nome Curto da Notícia 1] tá revolucionando TUDO porque [Impacto Chave da Notícia 1 de forma curta e impactante]! 😱\" | [Visual Sugerido para Notícia 1: ex: Ícone de cérebro brilhando]\n            ... (continuar para as ${topNews.length} notícias, mantendo a energia)\n            (tempo final) | APRESENTADOR(A): \"E aí, qual dessas te pegou de surpresa? 🤔 COMENTA AÍ embaixo! 👇 Não esquece de seguir pra não perder NADA do universo tech! 😉\" | Setas apontando para comentários, Ícone de 'seguir' piscando, emoji de piscadela.\n    `;
    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
    ];
    try {
        return await callOpenAI_API(messages);
    } catch (error) {
        logger.error("Erro ao gerar roteiro do YouTube Short com OpenAI:", error.message);
        return "Erro ao gerar roteiro do YouTube Short com OpenAI.";
    }
}

module.exports = {
    callOpenAI_API,
    getTop5ImpactfulNews,
    generateLinkedInArticle,
    generateYouTubeShortScript
};
