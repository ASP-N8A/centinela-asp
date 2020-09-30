const httpStatus = require('http-status');
const mongoose = require('mongoose');
// const { Issue } = require('../models');
const ApiError = require('../utils/ApiError');
const { getModelByTenant } = require('../utils/multitenancy');

const issueSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    severity: {
      type: Number,
      validate(value) {
        if (![1, 2, 3, 4].includes(value)) {
          throw new Error('Severity must be a number from 1 to 4');
        }
      },
    },
    developer: {
      type: String,
    },
    status: {
      type: String,
      enum: ['open', 'close'],
      default: 'open',
    },
  },
  {
    timestamps: true,
  }
);

const createIssue = async (issueBody) => {
  const tenantId = 'microsoft';
  const Issue = getModelByTenant(tenantId, 'issue', issueSchema);
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
  // const issues = await Issue.paginate(filter, options);
  // return issues;
  return [];
};

const getIssueById = async (id) => {
  // return Issue.findById(id);
  return null;
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
