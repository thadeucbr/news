// index.js
// Ponto de entrada do app
require('dotenv').config();

const { main } = require('./src/main');

if (process.env.ENABLE_SCHEDULE === '1' || process.env.ENABLE_SCHEDULE === 'true') {
    require('./src/scheduler');
} else {
    // Execução manual
    (async () => {
        try {
            await main();
        } catch (error) {
            console.error("Erro na execução principal manual:", error.message);
        }
    })();
}

