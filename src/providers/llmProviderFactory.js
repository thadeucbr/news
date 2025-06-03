// src/providers/llmProviderFactory.js
import * as openai from './openaiProvider.js';
import * as gemini from './geminiProvider.js';
import * as ollama from './ollamaProvider.js';

const providers = {
    openai,
    gemini,
    ollama
};

export function getProvider() {
    const name = (process.env.LLM_PROVIDER || 'openai').toLowerCase();
    if (!providers[name]) throw new Error(`LLM provider '${name}' não suportado.`);
    return providers[name];
}
