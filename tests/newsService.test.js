import { fetchWeeklyNews } from '../src/services/newsService.js';

describe('newsService', () => {
  it('deve retornar um array de notícias', async () => {
    const news = await fetchWeeklyNews();
    expect(Array.isArray(news)).toBe(true);
  });
});
