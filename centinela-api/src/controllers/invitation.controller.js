const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { invitationService, organizationService } = require('../services');
const { invitationEmailQueue } = require('../queue');
const { parseAuthToken } = require('../utils/parseAuthToken');
const logger = require('../config/logger');
const config = require('../config/config');

const createInvitation = catchAsync(async (req, res) => {
  const { authorization } = req.headers;
  const { org } = parseAuthToken(authorization);

  const invitation = await invitationService.createInvitation(req.body, org);
  const { name: orgName } = await organizationService.getOrganizationById(org);

  const data = {
    to: req.body.email,
    subject: 'Invitation to join organization',
    text: `Join our organization through the link: ${config.domain}/?company=${orgName}&token=${invitation._id}`,
  };
  invitationEmailQueue.add(data);
  logger.info(`Invitation for ${req.body.email} created`);
  res.status(httpStatus.CREATED).send(invitation);
});

const getInvitations = catchAsync(async (req, res) => {
  const { authorization } = req.headers;
  const { org } = parseAuthToken(authorization);
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await invitationService.queryInvitations(filter, options, org);
  logger.info(`Invitations listed for organization ${org}`);
  res.send(result);
});

const getInvitation = catchAsync(async (req, res) => {
  const invitation = await invitationService.getInvitationById(req.params.invitationId);
  if (!invitation) {
    logger.info(`Invitation ${req.params.invitationId} could not be returned because it does not exist`);
    throw new ApiError(httpStatus.NOT_FOUND, 'Invitation not found');
  }
  logger.info(`Invitation ${req.params.invitationId} returned`);
  res.send(invitation);
});

module.exports = {
  createInvitation,
  getInvitations,
  getInvitation,
};
