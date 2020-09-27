const { Invitation } = require('../models');

/**
 * Create an invitation
 * @param {Object} invitationBody
 * @returns {Promise<Invitation>}
 */

const createInvitation = async (invitationBody) => {
  const invitation = await Invitation.create(invitationBody);
  return invitation;
};

/**
 * Get invitation by id
 * @param {ObjectId} id
 * @returns {Promise<Invitation>}
 */
const getInvitationById = async (id) => {
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
const queryInvitations = async (filter, options) => {
  const invitations = await Invitation.paginate(filter, options);
  return invitations;
};

module.exports = {
  createInvitation,
  getInvitationById,
  queryInvitations,
};
