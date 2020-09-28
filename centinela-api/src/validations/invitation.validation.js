const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createInvitation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    role: Joi.string().required().valid('developer', 'admin'),
  }),
};

const getUsers = {
  query: Joi.object().keys({
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getInvitation = {
  params: Joi.object().keys({
    invitationId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createInvitation,
  getUsers,
  getInvitation,
};
