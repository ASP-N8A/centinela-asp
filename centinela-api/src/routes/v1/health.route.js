const express = require('express');
const healthController = require('../../controllers/health.controller');

const router = express.Router();

router.route('/').get(healthController.checkHealth);

module.exports = router;
