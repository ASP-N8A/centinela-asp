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

router
  .route('/:issueId')
  .get(auth('basic'), validate(issueValidation.getIssue), issueController.getIssue)
  .patch(auth('editIssue'), validate(issueValidation.updateIssue), issueController.updateIssue);

module.exports = router;
