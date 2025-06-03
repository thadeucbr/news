import axios from 'axios';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export async function chat(messages, options = {}) {
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY não configurada");
    const payload = {
        model: OPENAI_MODEL,
        messages,
        ...options
    };
    const response = await axios.post(OPENAI_API_URL, payload, {
        headers: {
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        },
        timeout: 60000
    });
    return response.data.choices[0].message.content;
}

export const name = 'openai';
