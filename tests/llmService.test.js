import { getTopImpactfulNews } from '../src/services/llmService.js';

describe('llmService', () => {
  it('deve retornar array vazio se não houver notícias', async () => {
    const result = await getTopImpactfulNews([]);
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });
});
