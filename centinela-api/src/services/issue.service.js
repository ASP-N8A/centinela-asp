const httpStatus = require('http-status');
const NodeCache = require('node-cache');
const { Issue } = require('../models');
const ApiError = require('../utils/ApiError');

const myCache = new NodeCache({ stdTTL: 60 });

const createIssue = async (issueBody) => {
  const issue = await Issue.create(issueBody);
  return issue;
};

/**
 * Query for issues
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryIssues = async (filter, options) => {
  const issues = await Issue.paginate(filter, options);
  return issues;
};

const getIssueById = async (id) => {
  return Issue.findById(id);
};

const updateIssueById = async (issueId, updateBody) => {
  const issue = await getIssueById(issueId);
  if (!issue) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Issue not found');
  }
  Object.assign(issue, updateBody);
  await issue.save();
  return issue;
};

const getCritical = async () => {
  let issues = myCache.get('issues');
  if (issues === undefined) {
    issues = await Issue.find({ status: 'open' });
    issues.sort((a, b) => (a.severity > b.severity ? 1 : -1));
    issues = issues.slice(0, 5);
    myCache.set('issues', issues);
    issues.push('B');
    return issues;
  }
  issues.push('A');
  return issues;
};

module.exports = {
  createIssue,
  queryIssues,
  getIssueById,
  updateIssueById,
  getCritical,
};
