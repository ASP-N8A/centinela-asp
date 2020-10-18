const { emailService, organizationService, issueService } = require('../services');

module.exports = async function (job) {
  const { orgId, issueId } = job.data;

  const org = await organizationService.getOrganizationById(orgId);

  if (!org) {
    return Promise.reject(
      new Error(`Error sending email for issue: ${issueId}, organization with id: ${orgId} does not exists`)
    );
  }
  const issue = await issueService.getIssueById(issueId, orgId);
  if (!issue) {
    return Promise.reject(new Error(`Error sending email, issue with id: ${issueId} does not exists`));
  }

  const { users } = org;

  const text = `Issue created: Id:${issue._id}, Title: ${issue.title}, Description: ${issue.description}, Severity: ${
    issue.severity
  },  Developer: ${issue.developer || 'Not asigned'}, Status: ${issue.status}`;
  const subject = `Issue created (${org.name})`;

  // eslint-disable-next-line no-restricted-syntax
  for await (const email of users) {
    try {
      await emailService.sendEmail(email, subject, text);
    } catch (e) {
      return Promise.reject(new Error(`error sending email, ${e.message}`));
    }
  }

  return Promise.resolve();
};
