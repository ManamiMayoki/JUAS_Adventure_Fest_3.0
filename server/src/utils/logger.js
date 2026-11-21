const formatMessage = (level, message) => {
  const timestamp = new Date().toISOString();
  return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
};

const logger = {
  info: (msg) => console.log(`\x1b[36m${formatMessage('info', msg)}\x1b[0m`),
  success: (msg) => console.log(`\x1b[32m${formatMessage('success', msg)}\x1b[0m`),
  warn: (msg) => console.warn(`\x1b[33m${formatMessage('warn', msg)}\x1b[0m`),
  error: (msg) => console.error(`\x1b[31m${formatMessage('error', msg)}\x1b[0m`),
};

module.exports = logger;
