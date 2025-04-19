const _ = require('lodash');
const moment = require('moment');
const { parsePhoneNumber } = require('awesome-phonenumber');

exports.genRes = (code, payload, type, noWrapPayload) => {
  noWrapPayload = noWrapPayload || false;
  type = type || 'unknown';

  if (code && code >= 300) {
    payload = _.isArray(payload) ? payload : [payload];
    const plainTextErrors =
      payload.length > 0 && _.isString(payload[0]) ? payload : [];
    const objectErrors =
      payload.length > 0 && _.isObject(payload[0]) ? payload : [];
    return {
      error: {
        errors: plainTextErrors,
        error_params: objectErrors,
        code,
        type,
      },
    };
  }
  if (payload && !noWrapPayload) {
    return { result: payload };
  }
  if (payload) {
    return payload;
  }
  return undefined;
};


exports.genOtp = () => {
  if (['development', 'uat', 'test'].includes(process.env.NODE_ENV)) {
    return 55555;
  }
  return Math.floor(10000 + Math.random() * 9000);
};

exports.getIp = (req) => req.headers.ipAddress || req.headers.ipaddress;
exports.getTimeFromZone = (date, timezone) =>
  moment(date).tz(timezone).format();

exports.getDaysBetween = (fromDate, toDate) => {
  const from = moment(fromDate);
  const to = moment(toDate);
  return to.diff(from, 'days');
};
exports.parseMobileNumber = (mobileNumber) => parsePhoneNumber(mobileNumber);
