const httpStatus = require('http-status');
const { IssueSchema } = require('../models');
const ApiError = require('../utils/ApiError');
const { getModelByTenant } = require('../models/util');

const createIssue = async (issueBody, orgId) => {
  const Issue = getModelByTenant(orgId, 'Issue', IssueSchema);
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
const queryIssues = async (filter, options, orgId) => {
  const Issue = getModelByTenant(orgId, 'Issue', IssueSchema);
  const issues = await Issue.paginate(filter, options);
  return issues;
};

const getIssueById = async (id, orgId) => {
  const Issue = getModelByTenant(orgId, 'Issue', IssueSchema);
  return Issue.findById(id);
};

const updateIssueById = async (issueId, updateBody, orgId) => {
  const issue = await getIssueById(issueId, orgId);
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
