const Queue = require('bull');

const invitationEmailQueue = new Queue('invitation-email');

module.exports.invitationEmailQueue = invitationEmailQueue;
