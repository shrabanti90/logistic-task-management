const express = require('express');

const router = express.Router();
const UserRouter = require('./User');


const TaskRouter = require('./Task');

const AuthHandler = require('../../../../models/helpers/AuthHelper');
const { usersRoles } = require('../../../../config/options');

router.use('/user', UserRouter);



router.use(
  '/task',
  AuthHandler.authenticateJWT(usersRoles.getWebArray()),
  TaskRouter
);

module.exports = router;
