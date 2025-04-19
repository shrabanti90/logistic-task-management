const express = require('express');

const router = express.Router();


/**
 * APIs routes.
 */

const AdminRouter = require('./admin/index');

router.use('/admin', AdminRouter);


module.exports = router;
