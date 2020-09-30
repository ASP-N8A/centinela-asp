const Joi = require('@hapi/joi');

const createKey = {
  body: Joi.object().keys({
    name: Joi.string().required(),
  }),
};

module.exports = {
  createKey,
};
