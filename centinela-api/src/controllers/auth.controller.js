const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, organizationService, invitationService } = require('../services');
const { ADMIN_ROLE } = require('../config/roles');
const ApiError = require('../utils/ApiError');

/**
 * Register organization and user
 */
const register = catchAsync(async (req, res) => {
  const {
    body: { name, organization, email, password },
  } = req;

  //  Create organization
  const org = await organizationService.createOrganization(organization);

  // Create user
  const userBody = {
    name,
    email,
    password,
    role: ADMIN_ROLE,
  };
  const user = await userService.createUser(userBody, org._id);

  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

/**
 * Register user from invite
 */
const registerUser = catchAsync(async (req, res) => {
  const {
    body: { name, email, password, invitationId, organization },
  } = req;

  //  Validate existing invitation
  const invitation = await invitationService.getInvitationById(invitationId, organization);
  if (!invitation || invitation.email !== email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid invitation');
  }

  //  Validate existing organization
  const org = await organizationService.getOrganizationById(organization);
  if (!org) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid invitation - Organization does not exist');
  }

  // Create user
  const userBody = {
    name,
    email,
    password,
    role: invitation.role,
  };
  const user = await userService.createUser(userBody, org._id);

  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const tokens = await tokenService.generateAuthTokens(user);
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
