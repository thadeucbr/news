// index.js
// Ponto de entrada do app
import 'dotenv/config';
import { main } from './src/main.js';

if (process.env.ENABLE_SCHEDULE === '1' || process.env.ENABLE_SCHEDULE === 'true') {
  await import('./src/scheduler.js');
} else {
  // Execução manual
  try {
    await main();
  } catch (error) {
    console.error("Erro na execução principal manual:", error.message);
  }
}

