const httpStatus = require('http-status');
const { InvitationSchema, User } = require('../models');
const { getModelByTenant } = require('../models/util');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

/**
 * Create an invitation
 * @param {Object} invitationBody
 * @returns {Promise<Invitation>}
 */

const createInvitation = async (invitationBody, orgId) => {
  if (await User.isEmailTaken(invitationBody.email)) {
    logger.info(`Invitation for ${invitationBody.email} could not be created because the email is already in use`);
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already in use');
  }

  const Invitation = getModelByTenant(orgId, 'Invitation', InvitationSchema);
  if (await Invitation.findOne({ email: invitationBody.email })) {
    logger.info(`Invitation for ${invitationBody.email} could not be created because the use has already been invited`);
    throw new ApiError(httpStatus.BAD_REQUEST, 'User has already been invited');
  }

  const invitation = await Invitation.create(invitationBody);
  return invitation;
};

/**
 * Get invitation by id
 * @param {ObjectId} id
 * @returns {Promise<Invitation>}
 */
const getInvitationById = async (id, orgId) => {
  const Invitation = getModelByTenant(orgId, 'Invitation', InvitationSchema);
  return Invitation.findById(id);
};

/**
 * Query for invitations
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryInvitations = async (filter, options, orgId) => {
  const Invitation = getModelByTenant(orgId, 'Invitation', InvitationSchema);
  const invitations = await Invitation.paginate(filter, options);
  return invitations;
};

const updateInvitation = async (invitationId, orgId, updateBody) => {
  const invitation = await getInvitationById(invitationId, orgId);
  if (!invitation) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Invitation not found');
  }

  Object.assign(invitation, updateBody);
  await invitation.save();
  return invitation;
};

module.exports = {
  createInvitation,
  getInvitationById,
  queryInvitations,
  updateInvitation,
};
