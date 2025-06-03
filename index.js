// index.js
// Ponto de entrada do app
require('dotenv').config();

const { main } = require('./src/main');
// Para rodar manualmente:
(async () => {
    try {
        await main();
    } catch (error) {
        console.error("Erro na execução principal manual:", error.message);
    }
})();

// Para rodar agendado, basta importar:
// require('./src/scheduler');

