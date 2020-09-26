const httpStatus = require('http-status');
const { Issue } = require('../models');
const ApiError = require('../utils/ApiError');

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

module.exports = {
  createIssue,
  queryIssues,
  getIssueById,
  updateIssueById,
};
