const catchAsync = require('../utils/catchAsync');
const healthService = require('../services/health.service');
const logger = require('../config/logger');

const checkHealth = catchAsync(async (req, res) => {
  const dbHealth = await healthService.checkDbHealth();
  const redisHealth = await healthService.checkRedisHealth();

  if (dbHealth && redisHealth) {
    logger.info(`Health check succesful`);
    res.status(200).send(`Health check succesful`);
  } else {
    if (!dbHealth) {
      logger.info(`Database health check unsuccesful`);
      res.status(500).send(`Database health check unsuccesful`);
    }
    if (!redisHealth) {
      logger.info(`Redis health check unsuccesful`);
      res.status(500).send(`Redis health check unsuccesful`);
    }
  }
});

module.exports = {
  checkHealth,
};
