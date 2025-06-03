import { fetchWeeklyNews } from './services/newsService.js';
import { getTopImpactfulNews, generateLinkedInArticle, generateYouTubeShortScript } from './services/llmService.js';
import { logger } from './utils/logger.js';

export async function main() {
    logger.info("Iniciando processo de automação de notícias com LLM...");
    const newsItems = await fetchWeeklyNews();
    if (!newsItems || newsItems.length === 0) {
        logger.info("Nenhuma notícia encontrada na última semana. Encerrando.");
        return;
    }
    logger.info(`\n--- ${newsItems.length} Notícias da Semana Encontradas ---`);
    const topNews = await getTopImpactfulNews(newsItems);
    if (!topNews || topNews.length === 0) {
        logger.info("Não foi possível identificar notícias impactantes ou a IA não retornou resultados. Encerrando geração de conteúdo.");
        return;
    }
    logger.info(`\n\n--- Top ${topNews.length} Notícias Mais Impactantes (Analisadas pela LLM) ---`);
    topNews.forEach(news => {
        logger.info(`Título: ${news.title}\nResumo IA: ${news.summary}\nImpacto IA: ${news.impact_reason}\n---`);
    });
    const linkedInArticle = await generateLinkedInArticle(topNews);
    logger.info("\n\n--- Artigo para LinkedIn (Gerado pela LLM) ---");
    logger.info(linkedInArticle);
    const youtubeShortScript = await generateYouTubeShortScript(topNews);
    logger.info("\n\n--- Roteiro para YouTube Short (Gerado pela LLM) ---");
    logger.info(youtubeShortScript);
    logger.info("\nProcesso concluído!");
}
