const httpStatus = require('http-status');
const { Organization } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Create an organization
 * @param {String} name
 * @returns {Promise<Organization>}
 */
const createOrganization = async (email, name) => {
  if (await Organization.isNameTaken(name)) {
    logger.info(`${email} tried to create organization ${name} but the name is taken`);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Organization name already created');
  }

  const organization = await Organization.create({ name });

  return organization;
};

/**
 * Get organization by id
 * @param {ObjectId} id
 * @returns {Promise<Organization>}
 */
const getOrganizationById = async (id) => {
  return Organization.findById(id);
};

/**
 * Get organization by name
 * @param {String} name
 * @returns {Promise<Organization>}
 */
const getOrganizationByName = async (name) => {
  return Organization.findOne({ name });
};

/**
 * Add user to organization
 * @param {ObjectId} orgId - user id to add
 * @param {ObjectId} userId - user id to add
 * @returns {Promise<Organization>}
 */
const addUserToOrganization = async (orgId, userId) => {
  const organization = await getOrganizationById(orgId);
  if (!organization) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Organization not found');
  }
  organization.users.push(userId);
  await organization.save();
};

module.exports = {
  createOrganization,
  getOrganizationById,
  addUserToOrganization,
  getOrganizationByName,
};
