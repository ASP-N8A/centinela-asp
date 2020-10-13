const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const ApiError = require('./ApiError');
const config = require('../config/config');

const parseAuthToken = (authorization) => {
  if (authorization.startsWith('Bearer ')) {
    const token = authorization.substring(7, authorization.length);
    return jwt.verify(token, config.jwt.secret);
  }
  throw new ApiError(httpStatus.BAD_REQUEST, 'Token is not valid');
};

exports.parseAuthToken = parseAuthToken;
