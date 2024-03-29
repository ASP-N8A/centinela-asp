const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const keyValidation = require('../../validations/key.validation');
const keyController = require('../../controllers/key.controller');

const router = express.Router();

router.route('/').post(auth('manageInvitations'), validate(keyValidation.createkey), keyController.createKey);

module.exports = router;
