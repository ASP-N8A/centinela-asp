const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { keyService } = require('../services');
const ApiError = require('../utils/ApiError');
const config = require('../config/config');

// TODO. Move this function to /utils since it's going to be used a lot
const getPayload = (authorization) => {
  if (authorization.startsWith('Bearer ')) {
    const token = authorization.substring(7, authorization.length);
    return jwt.verify(token, config.jwt.secret);
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Token is not valid');
};

const createKey = catchAsync(async (req, res) => {
  const { authorization } = req.headers;
  const { orgId } = getPayload(authorization);
  const key = await keyService.createKey({ ...req.body, orgId });
  res.status(httpStatus.CREATED).send(key);
});

module.exports = {
  createKey,
};
