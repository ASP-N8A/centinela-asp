const { mongodb } = require('./mongoUtils');
const ApiError = require('./ApiError');
const logger = require('../config/logger');

/**
 * Creating New MongoDb Connection obect by Switching DB
 */
const getTenantDB = (tenantId, modelName, schema) => {
  const dbName = `centinela${tenantId}`;
  logger.info(mongodb);
  if (mongodb) {
    // useDb will return new connection
    logger.info(`mongodb exists ${dbName}`);
    const db = mongodb.useDb(dbName, { useCache: true });
    logger.info(`DB switched to ${dbName}`);
    db.model(modelName, schema);
    return db;
  }
  return new ApiError(507, 'get tenant DB error');
};

/**
 * Return Model as per tenant
 */
exports.getModelByTenant = (tenantId, modelName, schema) => {
  logger.info(`getModelByTenant tenantId : ${tenantId}.`);
  const tenantDb = getTenantDB(tenantId, modelName, schema);
  return tenantDb.model(modelName);
};
