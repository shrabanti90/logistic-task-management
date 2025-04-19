const express = require('express');

const router = express.Router();
const { checkSchema } = require('express-validator');

const AuthHandler = require('../../../../models/helpers/AuthHelper');
const UserControl = require('../../../../controllers/api/v1/admin/User');
const SystemUser = require('../../../../schema-validation/SystemUser');
const UserSchema = require('../../../../schema-validation/User');
const ErrorHandleHelper = require('../../../../models/helpers/ErrorHandleHelper');
const { usersRoles } = require('../../../../config/options');

// router.post(
//   '/sign-up',
//   checkSchema(UserSchema.signUp),
//   ErrorHandleHelper.requestValidator,
//   UserControl.signUp
// );
router.post(
  '/admin-send-mobile-otp',
  checkSchema(SystemUser.login),
  ErrorHandleHelper.requestValidator,
  UserControl.adminSendMobileOtp
);
// router.post(
//   '/send-mobile-otp',
//   checkSchema(SystemUser.login),
//   ErrorHandleHelper.requestValidator,
//   UserControl.sendMobileOtp
// );
router.patch(
  '/verify-mobile-otp',
  checkSchema(UserSchema.verifyMobileOtp),
  ErrorHandleHelper.requestValidator,
  UserControl.verifyMobileOtp
);

router.post(
  '/send-email-otp',
  checkSchema(UserSchema.sendEmailOtp),
  ErrorHandleHelper.requestValidator,
  UserControl.sendEmailOtp
);

// router.post(
//   '/resend-email-otp',
//   checkSchema(UserSchema.sendEmailOtp),
//   ErrorHandleHelper.requestValidator,
//   UserControl.reSendEmailOtp
// );
router.patch(
  '/verify-email-otp',
  checkSchema(UserSchema.verifyEmailOtp),
  ErrorHandleHelper.requestValidator,
  UserControl.verifyEmailOtp
);

// router.post(
//   '/send-change-mobile-otp',
//   AuthHandler.authenticateJWT(usersRoles.getWebArray()),
//   checkSchema(SystemUser.login),
//   ErrorHandleHelper.requestValidator,
//   UserControl.sendMobileOtpToChangeNumber
// );

// router.patch(
//   '/change-mobile',
//   AuthHandler.authenticateJWT(usersRoles.getWebArray()),
//   checkSchema(UserSchema.verifyMobileOtp),
//   ErrorHandleHelper.requestValidator,
//   UserControl.verifyMobileOtpToChangeNumber
// );

// router.post(
//   '/send-change-email-otp',
//   AuthHandler.authenticateJWT(usersRoles.getWebArray()),
//   checkSchema(UserSchema.sendEmailOtp),
//   ErrorHandleHelper.requestValidator,
//   UserControl.sendEmailOtpToChangeEmail
// );

// router.patch(
//   '/change-email',
//   AuthHandler.authenticateJWT(usersRoles.getWebArray()),
//   checkSchema(UserSchema.verifyEmailOtp),
//   ErrorHandleHelper.requestValidator,
//   UserControl.verifyEmailOtpToChangeEmail
// );


// router.put(
//   '/',
//   AuthHandler.authenticateJWT(usersRoles.getWebArray()),
//   checkSchema(UserSchema.updateInfo),
//   ErrorHandleHelper.requestValidator,
//   UserControl.userUpdate
// );

router.get(
  '/',
  AuthHandler.authenticateJWT(usersRoles.getWebArray()),
  UserControl.getUserProfile
);
// router.patch(
//   '/bulk-delete',
//   AuthHandler.authenticateJWT(usersRoles.getWebArray()),
//   checkSchema(UserSchema.bulkDelete),
//   ErrorHandleHelper.requestValidator,
//   UserControl.bulkDelete
// );
// router.patch(
//   '/:id',
//   AuthHandler.authenticateJWT(usersRoles.getWebArray()),
//   checkSchema(UserSchema.changeStatus),
//   ErrorHandleHelper.requestValidator,
//   UserControl.changeStatus
// );
// router.delete(
//   '/:id',
//   AuthHandler.authenticateJWT(usersRoles.getWebArray()),
//   UserControl.deleteUser
// );

module.exports = router;
