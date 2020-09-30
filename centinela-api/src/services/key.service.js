const jwt = require('jsonwebtoken');

const { Key } = require('../models');
const config = require('../config/config');

const createKey = async (keyBody) => {
  const { name } = keyBody;
  const payload = {
    organization: 'org1',
    name,
  };
  const token = jwt.sign(payload, config.jwt.secret);
  const key = await Key.create({ token, name });

  return key;
};

module.exports = {
  createKey,
};
