const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { keyService } = require('../services');

const createKey = catchAsync(async (req, res) => {
  const key = await keyService.createKey(req.body);
  res.status(httpStatus.CREATED).send(key);
});

module.exports = {
  createKey,
};
