const jwt = require('jsonwebtoken');

const { Key } = require('../models');
const config = require('../config/config');

const createKey = async (keyBody) => {
  const { name, org } = keyBody;
  const payload = {
    orgId: org,
    name,
  };
  const token = jwt.sign(payload, config.jwt.secret);
  const key = await Key.create({ token, name });

  return key;
};

module.exports = {
  createKey,
};
