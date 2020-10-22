const httpStatus = require('http-status');
const redis = require('redis');
const { promisify } = require('util');
const { IssueSchema } = require('../models');
const ApiError = require('../utils/ApiError');
const { getModelByTenant } = require('../models/util');
const config = require('../config/config');
const logger = require('../config/logger');

const client = redis.createClient({ port: config.redis.port, host: config.redis.host, password: config.redis.password });
const GET_ASYNC = promisify(client.get).bind(client);

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
    logger.info(`Issue with Id ${issueId} not found`);
    throw new ApiError(httpStatus.NOT_FOUND, 'Issue not found');
  }
  Object.assign(issue, updateBody);
  await issue.save();
  return issue;
};

const getCritical = async (orgId) => {
  const reply = await GET_ASYNC(orgId);
  if (reply) {
    logger.info(`Critical issues returned from cache`);
    return JSON.parse(reply);
  }

  const Issue = getModelByTenant(orgId, 'Issue', IssueSchema);
  let issues = await Issue.find({ status: 'open' });
  issues.sort((a, b) => (a.severity > b.severity ? 1 : -1));
  issues = issues.slice(0, 5);
  if (issues !== '') {
    client.set(orgId, JSON.stringify(issues));
    client.expire(orgId, 60);
  }
  logger.info(`Critical issues returned from database`);
  return issues;
};

/**
 *
 * @param {Object} period
 * @param {Date} [period.dateFrom]
 * @param {number} [period.dateTo]
 * @param {ObjetctId} orgId
 */
const queryStatistics = async (period, orgId) => {
  const Issue = getModelByTenant(orgId, 'Issue', IssueSchema);
  const { dateFrom, dateTo } = period;
  let query = {
    createdAt: {
      $gte: dateFrom,
      $lt: dateTo,
    },
  };
  const total = await Issue.count(query);
  const severities = await Issue.aggregate([{ $match: query }, { $group: { _id: '$severity', count: { $sum: 1 } } }]);
  severities.sort((a, b) => a._id - b._id);
  query = {
    ...query,
    status: 'close',
  };
  const resolved = await Issue.count(query);

  logger.info(`Statistics colected.`);

  return { total, resolved, severities };
};

/**
 *
 * @param {ObjectId} issueId
 * @param {ObjectId} orgId
 */
const closeIssue = async (issueId, orgId) => {
  const issue = await getIssueById(issueId, orgId);

  if (!issue) {
    logger.info(`Issue with Id ${issueId} not found`);
    throw new ApiError(httpStatus.NOT_FOUND, 'Issue not found');
  }

  Object.assign(issue, { status: 'close' });
  await issue.save();
  return issue;
};

module.exports = {
  createIssue,
  queryIssues,
  getIssueById,
  updateIssueById,
  getCritical,
  queryStatistics,
  closeIssue,
};
