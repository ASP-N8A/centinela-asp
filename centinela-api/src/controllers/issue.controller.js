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

const createIssue = catchAsync(async (req, res) => {
  const accessKey = req.headers['access-key'];
  if (!accessKey) {
    logger.info('Issue could not be created because there was no key provided');
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'In order to create an issue for your organization you must provide the key in the Headers'
    );
  }

  const { orgId } = jwt.verify(accessKey, config.jwt.secret);
  if (!orgId) {
    logger.info('Issue could not be created because the key was invalid');
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Access key not valid');
  }

  const issue = await issueService.createIssue(req.body, orgId);
  await issueEmailQueue.add({ orgId, issueId: issue._id });

  res.status(httpStatus.CREATED).send(issue);
});

const getIssues = catchAsync(async (req, res) => {
  const { authorization } = req.headers;
  const { org } = parseAuthToken(authorization);

  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);

  const result = await issueService.queryIssues(filter, options, org);
  res.send(result);
});

const getIssue = catchAsync(async (req, res) => {
  const issue = await issueService.getIssueById(req.params.issueId);
  if (!issue) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Issue not found');
  }
  res.send(issue);
});

const updateIssue = catchAsync(async (req, res) => {
  const { authorization } = req.headers;
  const { org } = parseAuthToken(authorization);
  const issue = await issueService.updateIssueById(req.params.issueId, req.body, org);
  res.send(issue);
});

const getCritical = catchAsync(async (req, res) => {
  const accessKey = req.headers['access-key'];
  if (!accessKey) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      'In order to see the issues you must provide the organization key in the Headers'
    );
  }

  const { orgId } = jwt.verify(accessKey, config.jwt.secret);
  if (!orgId) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Access key not valid');
  }

  const issue = await issueService.getCritical(orgId);
  res.send(issue);
});

module.exports = {
  createIssue,
  getIssues,
  getIssue,
  updateIssue,
  getCritical,
};
