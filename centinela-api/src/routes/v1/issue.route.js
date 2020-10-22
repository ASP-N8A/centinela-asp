const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const issueValidation = require('../../validations/issue.validation');
const issueController = require('../../controllers/issue.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(issueValidation.createIssue), issueController.createIssue)
  .get(auth('basic'), validate(issueValidation.getIssues), issueController.getIssues);

router.route('/critical').get(validate(issueValidation.getIssues), issueController.getCritical);

router.route('/statistics').get(auth('statistics'), validate(issueValidation.getStatistics), issueController.getStatistics);

router
  .route('/:issueId')
  .get(auth('basic'), validate(issueValidation.getIssue), issueController.getIssue)
  .patch(auth('editIssue'), validate(issueValidation.updateIssue), issueController.updateIssue);

  router
  .route('/:issueId/close')
  .post(auth('basic'), validate(issueValidation.closeIssue), issueController.closeIssue);

module.exports = router;
