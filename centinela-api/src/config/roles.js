const ADMIN_ROLE = 'admin';
const DEVELOPER_ROLE = 'developer';

const roles = [ADMIN_ROLE, DEVELOPER_ROLE];

const roleRights = new Map();
roleRights.set(roles[0], ['basic', 'manageInvitations', 'editIssue', 'manageKeys', 'statistics']);
roleRights.set(roles[1], ['basic']);

module.exports = {
  roles,
  roleRights,
  ADMIN_ROLE,
  DEVELOPER_ROLE,
};
