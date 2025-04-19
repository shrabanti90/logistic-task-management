const router = require('express').Router();
const basicAuth = require('express-basic-auth');
const web = require('./web');
const mobile = require('./mobile');
router.use('/v1/web/admin',basicAuth({
    users: {
        [process.env.SWAGGER_WEB_ADMIN]: process.env.SWAGGER_WEB_PASSWORD
    },
    challenge: true
}), web);
router.use('/v1/mobile',basicAuth({
    users: {
        [process.env.SWAGGER_MOBILE_USER]: process.env.SWAGGER_MOBILE_PASSWORD
    },
    challenge: true
}), mobile);
module.exports = router;