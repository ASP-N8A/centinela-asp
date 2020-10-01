const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const invitationValidation = require('../../validations/invitation.validation');
const invitationController = require('../../controllers/invitation.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(invitationValidation.createInvitation), invitationController.createInvitation)
  .get(auth('manageInvitations'), validate(invitationValidation.getInvitations), invitationController.getInvitations);

router.route('/:invitationId').get(validate(invitationValidation.getInvitation), invitationController.getInvitation);

module.exports = router;
