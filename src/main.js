// src/main.js
// Orquestra o fluxo principal do app

const { fetchWeeklyNews } = require('./services/newsService');
const { getTop5ImpactfulNews, generateLinkedInArticle, generateYouTubeShortScript } = require('./services/llmService');
const { logger } = require('./utils/logger');

async function main() {
    logger.info("Iniciando processo de automação de notícias com OpenAI...");
    const newsItems = await fetchWeeklyNews();
    if (!newsItems || newsItems.length === 0) {
        logger.info("Nenhuma notícia encontrada na última semana. Encerrando.");
        return;
    }
    logger.info(`\n--- ${newsItems.length} Notícias da Semana Encontradas ---`);
    const topNews = await getTop5ImpactfulNews(newsItems);
    if (!topNews || topNews.length === 0) {
        logger.info("Não foi possível identificar notícias impactantes ou a IA não retornou resultados. Encerrando geração de conteúdo.");
        return;
    }
    logger.info(`\n\n--- Top ${topNews.length} Notícias Mais Impactantes (Analisadas pela OpenAI) ---`);
    topNews.forEach(news => {
        logger.info(`Título: ${news.title}\nResumo IA: ${news.summary}\nImpacto IA: ${news.impact_reason}\n---`);
    });
    const linkedInArticle = await generateLinkedInArticle(topNews);
    logger.info("\n\n--- Artigo para LinkedIn (Gerado pela OpenAI) ---");
    logger.info(linkedInArticle);
    const youtubeShortScript = await generateYouTubeShortScript(topNews);
    logger.info("\n\n--- Roteiro para YouTube Short (Gerado pela OpenAI) ---");
    logger.info(youtubeShortScript);
    logger.info("\nProcesso concluído!");
}

module.exports = { main };
