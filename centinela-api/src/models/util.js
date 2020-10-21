const mongoose = require('mongoose');
const logger = require('../config/logger');

/**
 * Creating New MongoDb Connection obect by Switching DB
 */
const getTenantDB = (tenantId, modelName, schema) => {
  const dbName = `centineladb_${tenantId}`;
  const db = mongoose.connection.useDb(dbName, { useCache: true });
  logger.info(`DB switched to ${dbName}`);
  db.model(modelName, schema);
  return db;
};

/**
 * Return Model as per tenant
 */
exports.getModelByTenant = (tenantId, modelName, schema) => {
  const tenantDb = getTenantDB(tenantId, modelName, schema);
  return tenantDb.model(modelName);
};
