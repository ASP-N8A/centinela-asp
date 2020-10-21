const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const issueRoute = require('./issue.route');
const invitationRoute = require('./invitation.route');
const keyRoute = require('./key.route');
const healthRoute = require('./health.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/docs', docsRoute);
router.use('/issues', issueRoute);
router.use('/invitations', invitationRoute);
router.use('/keys', keyRoute);
router.use('/health', healthRoute);

module.exports = router;
