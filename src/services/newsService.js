// src/services/newsService.js
// Serviço para buscar e processar notícias de fontes RSS

import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { logger } from '../utils/logger.js';

export async function fetchWeeklyNews() {
    logger.info("Buscando notícias da semana de fontes reais...");
    let allNews = [];
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const sources = [
        {
            name: "TechCrunch AI",
            url: "https://techcrunch.com/category/artificial-intelligence/feed/",
            type: "rss"
        },
        {
            name: "VentureBeat AI",
            url: "https://venturebeat.com/category/ai/feed/",
            type: "rss"
        },
    ];
    for (const source of sources) {
        try {
            logger.info(`Buscando notícias de: ${source.name}`);
            if (source.type === "rss") {
                const response = await axios.get(source.url, {
                    timeout: 20000,
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 NewsAggregator/1.0'
                    }
                });
                const rssData = await parseStringPromise(response.data);
                let items = [];
                if (rssData.rss && rssData.rss.channel && rssData.rss.channel[0] && rssData.rss.channel[0].item) {
                    items = rssData.rss.channel[0].item;
                } else if (rssData.feed && rssData.feed.entry) {
                    items = rssData.feed.entry.map(entry => {
                        let link = '#';
                        if (entry.link && Array.isArray(entry.link)) {
                            const alternateLink = entry.link.find(l => l.$ && l.$.rel === 'alternate' && l.$.type === 'text/html');
                            if (alternateLink && alternateLink.$.href) {
                                link = alternateLink.$.href;
                            } else if (entry.link[0] && entry.link[0].$ && entry.link[0].$.href) {
                                link = entry.link[0].$.href;
                            } else if (entry.link[0] && typeof entry.link[0] === 'string') {
                                link = entry.link[0];
                            }
                        } else if (entry.link && entry.link.$ && entry.link.$.href) {
                            link = entry.link.$.href;
                        }
                        return {
                            title: (entry.title && entry.title[0] && (entry.title[0]._ || entry.title[0])) || 'Sem título',
                            link: link,
                            pubDate: (entry.published && entry.published[0]) || (entry.updated && entry.updated[0]) || new Date().toISOString(),
                            description: (entry.summary && entry.summary[0] && (entry.summary[0]._ || entry.summary[0])) || (entry.content && entry.content[0] && (entry.content[0]._ || entry.content[0])) || ''
                        };
                    });
                }
                for (const item of items) {
                    const title = (item.title && item.title[0] && (typeof item.title[0] === 'string' ? item.title[0] : item.title[0]._)) || item.title || 'Sem título';
                    let link = '#';
                    if (item.link && typeof item.link === 'string') {
                        link = item.link;
                    } else if (item.link && item.link[0] && item.link[0].$ && item.link[0].$.href) {
                        link = item.link[0].$.href;
                    } else if (item.link && item.link[0] && typeof item.link[0] === 'string') {
                        link = item.link[0];
                    } else if (item.guid && item.guid[0]) {
                        const guidContent = typeof item.guid[0] === 'string' ? item.guid[0] : (item.guid[0]._ || '');
                        if (guidContent.startsWith('http')) {
                            link = guidContent;
                        }
                    }
                    const pubDateStr = (item.pubDate && item.pubDate[0]) || item.pubDate || (item.published && item.published[0]) || new Date().toISOString();
                    let description = '';
                    if (item.description && typeof item.description === 'string') {
                        description = item.description;
                    } else if (item.description && item.description[0]) {
                        description = (typeof item.description[0] === 'string' ? item.description[0] : (item.description[0]._ || ''));
                    } else if (item["content:encoded"] && item["content:encoded"][0]) {
                        description = item["content:encoded"][0];
                    } else if (item.summary && typeof item.summary === 'string') {
                        description = item.summary;
                    } else if (item.summary && item.summary[0]) {
                        description = (typeof item.summary[0] === 'string' ? item.summary[0] : (item.summary[0]._ || ''));
                    }
                    const pubDate = new Date(pubDateStr);
                    if (pubDate >= oneWeekAgo && link !== '#') {
                        allNews.push({
                            title: String(title).trim(),
                            link: String(link).trim(),
                            source: source.name,
                            date: pubDate.toISOString().split('T')[0],
                            summary: String(description).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 300).trim() + '...'
                        });
                    }
                }
            } else if (source.type === "scrape") {
                logger.warn(`Web scraping para \"${source.name}\" não implementado neste exemplo.`);
            }
        } catch (error) {
            logger.error(`Erro ao buscar notícias de ${source.name}: ${error.message}`);
            if (error.code === 'ECONNABORTED') {
                logger.error(`Timeout ao buscar de ${source.name}.`);
            } else if (error.response) {
                logger.error(`Status do erro: ${error.response.status}. Data: ${JSON.stringify(error.response.data)}`);
            }
        }
    }
    const uniqueNews = Array.from(new Map(allNews.map(item => [item.link, item])).values());
    logger.info(`Total de ${uniqueNews.length} notícias únicas encontradas na última semana.`);
    return uniqueNews;
}
