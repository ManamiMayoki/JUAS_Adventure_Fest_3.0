const cluster = require('cluster');
const os = require('os');
const logger = require('./utils/logger');

if (cluster.isPrimary) {
  // On an Azure B2s (2 vCPU) or multi-core server, scale workers to match available CPUs
  const numCPUs = os.cpus().length;
  const workerCount = Math.min(numCPUs, 4);

  logger.info(`[Cluster Master] Launching ${workerCount} worker threads for high concurrency (1,000+ users)...`);

  for (let i = 0; i < workerCount; i++) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    logger.success(`[Cluster Worker] Worker #${worker.process.pid} is online and accepting connections.`);
  });

  cluster.on('exit', (worker, code, signal) => {
    logger.warn(`[Cluster Worker] Worker #${worker.process.pid} died (${signal || code}). Respawning...`);
    cluster.fork();
  });
} else {
  // Worker process runs the Express server
  require('./server');
}
