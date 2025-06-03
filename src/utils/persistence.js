// src/utils/persistence.js
// Abstrai persistência de notícias usadas: MongoDB ou arquivo local JSON

import fs from 'fs/promises';
import path from 'path';
let mongodbClient = null;
let usedNewsCollection = null;

const USED_NEWS_STORAGE = (process.env.USED_NEWS_STORAGE || 'local').toLowerCase();
const USE_MONGO = USED_NEWS_STORAGE === 'mongo' && !!process.env.MONGODB_URI;
const USED_NEWS_FILE = path.resolve(process.cwd(), 'used_news.json');

async function connectMongo() {
  if (!mongodbClient) {
    const { MongoClient } = await import('mongodb');
    mongodbClient = new MongoClient(process.env.MONGODB_URI, { useUnifiedTopology: true });
    await mongodbClient.connect();
    const db = mongodbClient.db(process.env.MONGODB_DB || 'news');
    usedNewsCollection = db.collection(process.env.MONGODB_COLLECTION || 'used_news');
  }
}

export async function wasNewsUsed(newsLink) {
  if (USE_MONGO) {
    await connectMongo();
    const found = await usedNewsCollection.findOne({ link: newsLink });
    return !!found;
  } else {
    try {
      const data = JSON.parse(await fs.readFile(USED_NEWS_FILE, 'utf-8'));
      return !!data.find(n => n.link === newsLink);
    } catch {
      return false;
    }
  }
}

export async function markNewsAsUsed(news) {
  if (USE_MONGO) {
    await connectMongo();
    await usedNewsCollection.updateOne(
      { link: news.link },
      { $set: news },
      { upsert: true }
    );
  } else {
    let data = [];
    try {
      // Sempre lê o arquivo atualizado antes de adicionar
      const fileContent = await fs.readFile(USED_NEWS_FILE, 'utf-8');
      data = JSON.parse(fileContent);
    } catch {}
    // Garante que não há duplicidade pelo link
    if (!data.find(n => n.link === news.link)) {
      data.push(news);
      // Escreve o array completo de volta
      await fs.writeFile(USED_NEWS_FILE, JSON.stringify(data, null, 2));
    }
  }
}
