// src/providers/llmProviderFactory.js
const openai = require('./openaiProvider');
const gemini = require('./geminiProvider');
const ollama = require('./ollamaProvider');

const providers = {
    openai,
    gemini,
    ollama
};

function getProvider() {
    const name = (process.env.LLM_PROVIDER || 'openai').toLowerCase();
    if (!providers[name]) throw new Error(`LLM provider '${name}' não suportado.`);
    return providers[name];
}

module.exports = { getProvider };
