const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, organizationService } = require('../services');
const { ADMIN_ROLE } = require('../config/roles');
const { Organization, User } = require('../models');
const ApiError = require('../utils/ApiError');

const register = catchAsync(async (req, res) => {
  const {
    body: { name, organization, email, password },
  } = req;

  //  Validate existing organization and user
  if (await Organization.isNameTaken(organization)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Organization name already created');
  }
  if (await User.isEmailTaken(email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }

  // Create organization
  const org = await organizationService.createOrganization(organization);

  const userBody = {
    name,
    email,
    password,
    organization: org._id,
    role: ADMIN_ROLE,
  };
  // Create user
  const user = await userService.createUser(userBody);

  //  Add user to organization
  await organizationService.addUserToOrganization(org._id, user._id);

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
  login,
  logout,
  refreshTokens,
};
