const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createIssue = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string(),
    severity: Joi.number().valid(1, 2, 3, 4),
  }),
};

const getIssues = {
  query: Joi.object().keys({
    title: Joi.string(),
    description: Joi.string(),
    severity: Joi.number(),
    developer: Joi.string().email(),
    status: Joi.string().valid('open', 'close'),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getIssue = {
  params: Joi.object().keys({
    issueId: Joi.string().custom(objectId),
  }),
};

const updateIssue = {
  params: Joi.object().keys({
    issueId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string().allow('').optional(),
      severity: Joi.number().valid(1, 2, 3, 4).optional(),
      developer: Joi.string().email().allow('').optional(),
      status: Joi.string().valid('open', 'close'),
    })
    .min(1),
};

module.exports = {
  createIssue,
  getIssues,
  getIssue,
  updateIssue,
};
