const Queue = require('bull');
const config = require('../config/config');

const invitationEmailQueue = new Queue('invitation-email', {
  redis: { port: config.redis.port, host: config.redis.host, password: config.redis.password },
});

module.exports.invitationEmailQueue = invitationEmailQueue;
