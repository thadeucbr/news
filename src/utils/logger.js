// src/utils/logger.js
// Logger simples para padronizar logs

export function info(...args) {
    console.log('[INFO]', ...args);
}
export function warn(...args) {
    console.warn('[WARN]', ...args);
}
export function error(...args) {
    console.error('[ERROR]', ...args);
}

export const logger = { info, warn, error };
