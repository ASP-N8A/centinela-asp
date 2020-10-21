const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { keyService } = require('../services');
const { parseAuthToken } = require('../utils/parseAuthToken');
const logger = require('../config/logger');

const createKey = catchAsync(async (req, res) => {
  const { authorization } = req.headers;
  const { org } = parseAuthToken(authorization);

  const key = await keyService.createKey({ ...req.body, org });
  logger.info(`Key created for organization ${org}`);
  res.status(httpStatus.CREATED).send(key);
});

module.exports = {
  createKey,
};
