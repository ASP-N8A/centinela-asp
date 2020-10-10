const { emailService } = require('../services');

module.exports = function (job) {
  const { to, subject, text } = job.data;
  return emailService
    .sendEmail(to, subject, text)
    .then((sentInfo) => sentInfo)
    .catch((e) => {
      return Promise.reject(new Error(`error sending email, ${e.message}`));
    });
};
