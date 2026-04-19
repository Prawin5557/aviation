type LogMeta = Record<string, unknown>;

const format = (level: 'info' | 'warn' | 'error', message: string, meta?: LogMeta) => {
  const timestamp = new Date().toISOString();
  return {
    timestamp,
    level,
    message,
    ...(meta ? { meta } : {}),
  };
};

export const logger = {
  info: (message: string, meta?: LogMeta) => {
    if (import.meta.env.DEV) {
      console.info(format('info', message, meta));
    }
  },
  warn: (message: string, meta?: LogMeta) => {
    console.warn(format('warn', message, meta));
  },
  error: (message: string, meta?: LogMeta) => {
    console.error(format('error', message, meta));
  },
};
