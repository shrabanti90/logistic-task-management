const UtilHelper = require('../models/helpers/UtilHelper');

const options = {
  defaultNumber: '1111111111',
  randomUsernameSize: 8,
  transactionNumber: 10000,
  jwtTokenExpiry: '2h',
  sixMonthExpiry: 6 * 30 * 24 * 60 * 60,
  defaultOTP: 555555,
  refreshTokenExpiryTime: 300,
  userNamePrefix: 'PS',
  otpExpireInDays: 1,
  defaultStatus: {
    PENDING: 'pending',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    BLOCKED: 'blocked',
    UNBLOCKED: 'unblocked',
    DELETED: 'deleted',
  },
 
  verificationStatus: {
    DID_NOT_VERIFY: 'did_not_verify',
   
  },
 
  
  tokenType: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
  },
  
  resCode: {
    HTTP_OK: 200,
    HTTP_CREATE: 201,
    HTTP_NO_CONTENT: 204,
    HTTP_BAD_REQUEST: 400,
    HTTP_UNAUTHORIZED: 401,
    HTTP_FORBIDDEN: 403,
    HTTP_NOT_FOUND: 404,
    HTTP_METHOD_NOT_ALLOWED: 405,
    HTTP_CONFLICT: 409,
    HTTP_INTERNAL_SERVER_ERROR: 500,
    HTTP_SERVICE_UNAVAILABLE: 503,
  },
  errorTypes: {
    OAUTH_EXCEPTION: 'OAuthException',
    ACCESS_DENIED_EXCEPTION: 'AccessDeniedException',
    ALREADY_AUTHENTICATED: 'AlreadyAuthenticated',
    UNAUTHORIZED_ACCESS: 'UnauthorizedAccess',
    FORBIDDEN: 'Forbidden',
    INPUT_VALIDATION: 'InputValidationException',
    ACCOUNT_ALREADY_EXIST: 'AccountAlreadyExistException',
    ACCOUNT_DOES_NOT_EXIST: 'AccountDoesNotExistException',
    ENTITY_NOT_FOUND: 'EntityNotFound',
    ACCOUNT_BLOCKED: 'AccountBlocked',
    ACCOUNT_DEACTIVATED: 'AccountDeactivated',
    DUPLICATE_REQUEST: 'DuplicateRequest',
    EMAIL_NOT_VERIFIED: 'emailNotVerified',
    MOBILE_NUMBER_NOT_VERIFIED: 'mobileNumberNotVerified',
    INTERNAL_SERVER_ERROR: 'InternalServerError',
    CATCH_ERRORS: 'Oops! something went wrong.',
  },
  errorMessage: {
    NOT_AUTHORIZED: 'Not authorized to perform this action',
    SERVER_ERROR: 'Oops! something went wrong.',
    OTP_INVALID: 'Invalid OTP',
    INCORRECT_DATA: (data) => `The ${data} entered is incorrect`,
    INVALID_REQUEST: 'Invalid Request',
    USER_ACCOUNT_BLOCKED: 'Your account has been blocked, Please contact admin',
    SAME_EMAIL: 'User with same email already exists',
    SAME_MOBILE_NUMBER: 'User with same mobile number already exists',
    ROLE_INVALID_LOGIN: 'Account access denied',
    NO_USER: (data) => `User does not exists with this ${data}`,
    EXISTS_USER: (data) => `User exists with ${data}`,
    DOES_NOT_EXIST: (data) => `The ${data} does not exist`,
    ALREADY_EXIST: (data) => `The ${data} already exist`,
    NO_PLAN: `Please subscribe plan to add employee`,
    RECHARGE_WALLET: `Please recharge wallet to add employee, current balance is not enough`,
    INVALID_PACKAGE_REQUEST: `Incorrect verification check!!Please check your package!!`,
  },
  successMessage: {
    OTP_SEND_SUCCESSFULLY_MOBILE: 'An OTP has been sent to Your Mobile Number',
    OTP_SEND_SUCCESSFULLY_EMAIL: 'An OTP has been Sent to Your Email',
    OTP_SEND_SUCCESSFULLY: 'An OTP has been Sent to Your Mobile Number',
    USER_STATUS_UPDATE: (user, status) =>
      `${user.firstName}'s profile is ${status}`,
    LOGOUT: 'You have logged out successfully',
    VERIFIED: (data) => `Your ${data} verified`,
    UPDATE_SUCCESS_MESSAGE: (data) => `${data} updated successfully`,
    SAVED_SUCCESS_MESSAGE: (data) => `${data} saved successfully`,
    DELETE_SUCCESS_MESSAGE: (data) => `${data} deleted successfully`,
    ADD_SUCCESS_MESSAGE: (data) => `${data} added successfully`,
    GENERATE_SUCCESS_MESSAGE: (data) => `${data} generate successfully`,
    CHANGED_SUCCESS_MESSAGE: (data) => `${data} changed successfully`,
    VERIFIED_SUCCESS_MESSAGE: (data) => `${data} verified successfully`,
    SEND_SUCCESS_MESSAGE: (data) => `${data} send successfully`,
  },
  usersRoles: {
    PROTO_SUPER_ADMIN: 'PROTO_SUPER_ADMIN',
    VENDOR: 'VENDOR',
    getAllRolesAsArray: () => Object.keys(options.usersRoles),
   
    getWebArray: () => [
      options.usersRoles.VENDOR,
      options.usersRoles.PROTO_SUPER_ADMIN,
    ],
    getAdminArray: () => [
      options.usersRoles.PROTO_SUPER_ADMIN,
    ],
  },

 
  
 
  genOtp: UtilHelper.genOtp,
  genRes: UtilHelper.genRes,
  
};

module.exports = options;
