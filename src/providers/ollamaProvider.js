// src/providers/ollamaProvider.js
const axios = require('axios');

const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434/api/chat";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama3";

async function chat(messages, options = {}) {
    // Ollama espera um array de mensagens, mas o formato é diferente
    const payload = {
        model: OLLAMA_MODEL,
        messages: messages.map(m => ({ role: m.role, content: m.content })),
        ...options
    };
    const response = await axios.post(OLLAMA_API_URL, payload, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 60000
    });
    // Ollama retorna a resposta em response.data.message.content
    return response.data.message.content;
}

module.exports = { chat, name: 'ollama' };
