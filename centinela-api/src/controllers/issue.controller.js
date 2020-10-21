const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { issueService } = require('../services');
const config = require('../config/config');
const { parseAuthToken } = require('../utils/parseAuthToken');
const logger = require('../config/logger');
const { issueEmailQueue } = require('../queue');
const { userService } = require('../services');
const { DEVELOPER_ROLE } = require('../config/roles');

const createIssue = catchAsync(async (req, res) => {
  const accessKey = req.headers['access-key'];
  if (!accessKey) {
    logger.info('Issue could not be created because there was no key provided');
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'In order to create an issue for your organization you must provide the key in the Headers'
    );
  }

  const { orgId, name } = jwt.verify(accessKey, config.jwt.secret);
  if (!orgId) {
    logger.info('Issue could not be created because the key was invalid');
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Access key not valid');
  }

  const issue = await issueService.createIssue({ ...req.body, keyName: name }, orgId);
  await issueEmailQueue.add({ orgId, issueId: issue._id });
  logger.info(`Issue with Id ${issue._id} created`);
  res.status(httpStatus.CREATED).send(issue);
});

const getIssues = catchAsync(async (req, res) => {
  const { authorization } = req.headers;
  const { org } = parseAuthToken(authorization);

  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await issueService.queryIssues(filter, options, org);
  logger.info(`Issues returned for organization ${org}`);
  res.send(result);
});

const getIssue = catchAsync(async (req, res) => {
  const { authorization } = req.headers;
  const { org } = parseAuthToken(authorization);

  const issue = await issueService.getIssueById(req.params.issueId, org);
  if (!issue) {
    logger.info(`Issue with Id ${req.params.issueId} not found`);
    throw new ApiError(httpStatus.NOT_FOUND, 'Issue not found');
  }
  logger.info(`Issue with Id ${req.params.issueId} returned`);
  res.send(issue);
});

const updateIssue = catchAsync(async (req, res) => {
  const { authorization } = req.headers;
  const { org } = parseAuthToken(authorization);

  if (!req.body.developer) {
    const issue = await issueService.updateIssueById(req.params.issueId, req.body, org);
    logger.info(`Issue with Id ${req.params.issueId} updated`);
    res.send(issue);
    return;
  }

  const user = await userService.getUserByEmail(req.body.developer);
  if (req.body.developer && !user) {
    logger.info(`User with email ${req.body.developer} does not exist`);
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  if (org.toString() !== user.organization.toString()) {
    logger.info(`User with email ${req.body.developer} does not exist in the organization`);
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }

  if (user.role !== DEVELOPER_ROLE) {
    logger.info(`User with email ${req.body.developer} is not a developer`);
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found');
  }
  const issue = await issueService.updateIssueById(req.params.issueId, req.body, org);
  logger.info(`Issue with Id ${req.params.issueId} updated`);
  res.send(issue);
});

const getCritical = catchAsync(async (req, res) => {
  const accessKey = req.headers['access-key'];
  if (!accessKey) {
    logger.info(`Critical issues could not be returned because the organization key was not provided`);
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'In order to see the issues you must provide the organization key in the Headers'
    );
  }

  const { orgId } = jwt.verify(accessKey, config.jwt.secret);
  if (!orgId) {
    logger.info(`Critical issues could not be returned because the organization key was invalid`);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Access key not valid');
  }

  const issue = await issueService.getCritical(orgId);
  res.send(issue);
});

const getStatistics = catchAsync(async (req, res) => {
  const { authorization } = req.headers;
  const { org } = parseAuthToken(authorization);

  const period = pick(req.query, ['dateFrom', 'dateTo']);

  const result = await issueService.queryStatistics(period, org);
  logger.info(`Statistics returned for organization ${org}`);
  res.send(result);
});

module.exports = {
  createIssue,
  getIssues,
  getIssue,
  updateIssue,
  getCritical,
  getStatistics,
};
