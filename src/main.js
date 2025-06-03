import { fetchWeeklyNews } from './services/newsService.js';
import { getTopImpactfulNews, generateLinkedInArticle, generateYouTubeShortScript } from './services/llmService.js';
import { logger } from './utils/logger.js';
import { wasNewsUsed, markNewsAsUsed } from './utils/persistence.js';
import fs from 'fs/promises';
import path from 'path';

export async function main() {
    logger.info("Iniciando processo de automação de notícias com LLM...");
    const newsItems = await fetchWeeklyNews();
    if (!newsItems || newsItems.length === 0) {
        logger.info("Nenhuma notícia encontrada na última semana. Encerrando.");
        return;
    }
    logger.info(`\n--- ${newsItems.length} Notícias da Semana Encontradas ---`);

    // Filtra notícias já usadas até atingir o TOP_NEWS_COUNT
    const topCount = parseInt(process.env.TOP_NEWS_COUNT, 10) || 5;
    const filteredNews = [];
    for (const n of newsItems) {
        if (!(await wasNewsUsed(n.link))) {
            filteredNews.push(n);
            if (filteredNews.length >= topCount) break;
        }
    }
    if (filteredNews.length === 0) {
        logger.info("Todas as notícias já foram utilizadas anteriormente. Nada novo para processar.");
        return;
    }

    const topNews = await getTopImpactfulNews(filteredNews);
    if (!topNews || topNews.length === 0) {
        logger.info("Não foi possível identificar notícias impactantes ou a IA não retornou resultados. Encerrando geração de conteúdo.");
        return;
    }
    logger.info(`\n\n--- Top ${topNews.length} Notícias Mais Impactantes (Analisadas pela LLM) ---`);
    for (const news of topNews) {
        logger.info(`Título: ${news.title}\nResumo IA: ${news.summary}\nImpacto IA: ${news.impact_reason}\n---`);
        // Marca como usada (salva no MongoDB ou JSON local)
        await markNewsAsUsed(news);
    }
    // Salva outputs em arquivos
    const outDir = path.resolve(process.cwd(), 'outputs');
    await fs.mkdir(outDir, { recursive: true });
    const linkedInArticle = await generateLinkedInArticle(topNews);
    const linkedInPath = path.join(outDir, `linkedin_${new Date().toISOString().slice(0,10)}.md`);
    await fs.writeFile(linkedInPath, linkedInArticle);
    logger.info(`Artigo do LinkedIn salvo em: ${linkedInPath}`);
    const youtubeShortScript = await generateYouTubeShortScript(topNews);
    const ytPath = path.join(outDir, `youtube_short_${new Date().toISOString().slice(0,10)}.txt`);
    await fs.writeFile(ytPath, youtubeShortScript);
    logger.info(`Roteiro do YouTube Short salvo em: ${ytPath}`);
    logger.info("\nProcesso concluído!");
}
