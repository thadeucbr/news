// src/providers/geminiProvider.js
const axios = require('axios');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

async function chat(messages, options = {}) {
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY não configurada");
    // Gemini espera um formato diferente de mensagens
    const prompt = messages.map(m => m.content).join("\n");
    const payload = {
        contents: [{ parts: [{ text: prompt }] }],
        ...options
    };
    const response = await axios.post(
        `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
        payload,
        { headers: { 'Content-Type': 'application/json' }, timeout: 60000 }
    );
    // Gemini retorna a resposta em response.data.candidates[0].content.parts[0].text
    return response.data.candidates[0].content.parts[0].text;
}

module.exports = { chat, name: 'gemini' };
