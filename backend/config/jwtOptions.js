const passportJWT = require("passport-jwt");
const { jwtTokenExpiry } = require("./options");

const { ExtractJwt } = passportJWT;

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = process.env.JWT_SECRET_KEY;
jwtOptions.expiry = jwtTokenExpiry;

module.exports = jwtOptions;
