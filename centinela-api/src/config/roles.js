const roles = ['admin', 'developer'];

const roleRights = new Map();
roleRights.set(roles[0], ['basic', 'manageInvitations', 'editIssue', 'manageKeys']);
roleRights.set(roles[1], ['basic']);

module.exports = {
  roles,
  roleRights,
};
