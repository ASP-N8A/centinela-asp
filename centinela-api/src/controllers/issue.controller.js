const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { issueService } = require('../services');

const createIssue = catchAsync(async (req, res) => {
  const issue = await issueService.createIssue(req.body);
  res.status(httpStatus.CREATED).send(issue);
});

const getIssues = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['status']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await issueService.queryIssues(filter, options);
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
  const issue = await issueService.updateIssueById(req.params.issueId, req.body);
  res.send(issue);
});

const getCritical = catchAsync(async (req, res) => {
  const issue = await issueService.getCritical();
  res.send(issue);
});

module.exports = {
  createIssue,
  getIssues,
  getIssue,
  updateIssue,
  getCritical,
};
