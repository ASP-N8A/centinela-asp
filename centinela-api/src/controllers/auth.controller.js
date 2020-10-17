const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, organizationService, invitationService } = require('../services');
const { ADMIN_ROLE } = require('../config/roles');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Register organization and user
 */
const register = catchAsync(async (req, res) => {
  const {
    body: { name, organization: orgName, email, password },
  } = req;

  // Create organization
  const org = await organizationService.createOrganization(orgName, email);
  logger.info(`Organization ${orgName} created by ${email}`);

  // Create user
  const userBody = {
    name,
    email,
    password,
    role: ADMIN_ROLE,
  };
  const user = await userService.createUser(userBody, org._id);

  const tokens = await tokenService.generateAuthTokens(user);
  logger.info(`User ${email} registered`);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

/**
 * Register user from invite
 */
const registerUser = catchAsync(async (req, res) => {
  const {
    body: { name, email, password, invitationId, organization },
  } = req;

  const org = await organizationService.getOrganizationByName(organization);

  if (!org) {
    logger.info(`User ${email} tried registering by invitation but the organization does not exist`);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid invitation - Organization does not exists');
  }

  //  Validate invitation
  const invitation = await invitationService.getInvitationById(invitationId, org._id);
  if (!invitation || invitation.email !== email) {
    logger.info(`User ${email} tried registering by invitation but the invitation is invalid`);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid invitation');
  }

  // Create user
  const userBody = {
    name,
    email,
    password,
    role: invitation.role,
  };

  const user = await userService.createUser(userBody, org._id);
  await invitationService.updateInvitation(invitationId, org._id, { status: 'accepted' });
  await organizationService.addUserToOrganization(org._id, email);

  const tokens = await tokenService.generateAuthTokens(user);
  logger.info(`User ${email} registered by invitation`);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
  logger.info(`User ${email} loged in`);
  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

module.exports = {
  register,
  registerUser,
  login,
  logout,
  refreshTokens,
};
