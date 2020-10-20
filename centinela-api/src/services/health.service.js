const redis = require('redis');
const { promisify } = require('util');
const { User } = require('../models');
const config = require('../config/config');

const client = redis.createClient({ port: config.redis.port, host: config.redis.host, password: config.redis.password });
const GET_ASYNC = promisify(client.get).bind(client);
const SET_ASYNC = promisify(client.set).bind(client);

const checkDbHealth = async () => {
  try {
    const users = await User.count();
    if (users) {
      return true;
    }
  } catch (error) {
    return false;
  }
  return false;
};

const checkRedisHealth = async () => {
  try {
    await SET_ASYNC('health', 'check');
  } catch (error) {
    return false;
  }
  client.expire('health', 5);
  const reply = await GET_ASYNC('health');
  if (reply) {
    return true;
  }
  return false;
};

module.exports = {
  checkDbHealth,
  checkRedisHealth,
};
