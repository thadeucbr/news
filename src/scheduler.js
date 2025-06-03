// src/scheduler.js
// Configuração do agendamento (cron)

const cron = require('node-cron');
const { main } = require('./main');
const { logger } = require('./utils/logger');

const cronSchedule = '0 9 * * 5'; // Sexta-feira às 09:00

const scheduledJob = cron.schedule(cronSchedule, () => {
    const now = new Date();
    logger.info(`\n--- [${now.toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})}] Iniciando tarefa agendada (${cronSchedule}) ---`);
    main().catch(error => {
        logger.error("Erro na execução principal agendada:", error.message);
    });
}, {
    scheduled: true,
    timezone: "America/Sao_Paulo"
});

const nextRun = scheduledJob.nextDate ? scheduledJob.nextDate() : null;
logger.info(`Tarefa agendada para: ${cronSchedule} (Fuso: America/Sao_Paulo).`);
if (nextRun) {
    logger.info(`Próxima execução: ${nextRun.toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})}`);
} else {
    logger.info("Não foi possível determinar a próxima execução agendada.");
}
