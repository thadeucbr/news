import { markNewsAsUsed, wasNewsUsed } from '../src/utils/persistence.js';
import fs from 'fs/promises';
import path from 'path';

describe('persistence', () => {
  const testNews = { title: 'Teste', link: 'http://test.com', summary: 'Resumo', impact_reason: 'Impacto' };
  const file = path.resolve(process.cwd(), 'used_news.json');

  beforeAll(async () => {
    await fs.writeFile(file, '[]');
  });

  it('deve marcar notícia como usada e detectar duplicidade', async () => {
    await markNewsAsUsed(testNews);
    const used = await wasNewsUsed(testNews.link);
    expect(used).toBe(true);
  });
});
