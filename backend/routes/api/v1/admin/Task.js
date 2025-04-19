const express = require('express');
const { checkSchema } = require('express-validator');
const ErrorHandleHelper = require('../../../../models/helpers/ErrorHandleHelper');

const router = express.Router();
const Task = require('../../../../controllers/api/v1/admin/Task');
const TaskValidator = require('../../../../schema-validation/Task');

router.get('/', Task.getTaskListing);

router.get('/:id', Task.getTask);

router.post(
  '/',
  checkSchema(TaskValidator.createOrUpdate),
  ErrorHandleHelper.requestValidator,
  Task.createTask
);

router.put(
  '/:id',
  checkSchema(TaskValidator.createOrUpdate),
  ErrorHandleHelper.requestValidator,
  Task.putUpdateTask
);


router.delete('/:id', Task.deleteTask);

module.exports = router;
