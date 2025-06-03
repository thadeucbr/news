// src/scheduler.js
// Configuração do agendamento (cron)

const cron = require('node-cron');
const { main } = require('./main');
const { logger } = require('./utils/logger');

const cronSchedule = process.env.CRON_SCHEDULE || '0 9 * * 5'; // Sexta-feira às 09:00
const timezone = process.env.TIMEZONE || 'America/Sao_Paulo';

const scheduledJob = cron.schedule(cronSchedule, () => {
    const now = new Date();
    logger.info(`\n--- [${now.toLocaleString("pt-BR", {timeZone: timezone})}] Iniciando tarefa agendada (${cronSchedule}) ---`);
    main().catch(error => {
        logger.error("Erro na execução principal agendada:", error.message);
    });
}, {
    scheduled: true,
    timezone
});

const nextRun = scheduledJob.nextDate ? scheduledJob.nextDate() : null;
logger.info(`Tarefa agendada para: ${cronSchedule} (Fuso: ${timezone}).`);
if (nextRun) {
    logger.info(`Próxima execução: ${nextRun.toLocaleString("pt-BR", {timeZone: timezone})}`);
} else {
    logger.info("Não foi possível determinar a próxima execução agendada.");
}
