// src/utils/logger.js
// Logger simples para padronizar logs

function info(...args) {
    console.log('[INFO]', ...args);
}
function warn(...args) {
    console.warn('[WARN]', ...args);
}
function error(...args) {
    console.error('[ERROR]', ...args);
}

const logger = { info, warn, error };
module.exports = { logger };
