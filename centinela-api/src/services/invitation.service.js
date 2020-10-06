const { InvitationSchema } = require('../models');
const { getModelByTenant } = require('../models/util');

/**
 * Create an invitation
 * @param {Object} invitationBody
 * @returns {Promise<Invitation>}
 */

const createInvitation = async (invitationBody, orgId) => {
  const Invitation = getModelByTenant(orgId, 'Invitation', InvitationSchema);
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

module.exports = {
  createInvitation,
  getInvitationById,
  queryInvitations,
};
