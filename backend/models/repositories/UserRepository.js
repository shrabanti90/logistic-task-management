const sequelize = require('sequelize');

const { User } = require('..');
const {
  transactionNumber,
  errorMessage,
  defaultStatus,
  usersRoles,
  
  
  
} = require('../../config/options');
const { Op } = sequelize;

exports.modifyResponseData = (existingUser) => ({
  email: existingUser.email,
  name: existingUser.name,
  mobileNumber: existingUser.mobileNumber,
  countryCode: existingUser.countryCode,
  tempOtp: existingUser.tempOtp,
  role: existingUser.role,
  isMobileNumberVerified: existingUser.isMobileNumberVerified,
  isEmailVerified: existingUser.isEmailVerified,
  timeShiftId: existingUser.timeShiftId,
  aadharImage: existingUser.aadharImage,
});

exports.modifyOutputData = (existingUser) => ({
  id: existingUser.id,
  associateId: existingUser.associateId,
  email: existingUser.email,
  name: existingUser.name,
  mobileNumber: existingUser.mobileNumber,
  countryCode: existingUser.countryCode,
  role: existingUser.role,
  status: existingUser.status,
  profilePicture: existingUser.profilePicture,
  designation: existingUser.designation || null,
  //facialImage: existingUser.facialImage || null,
  profileIdentifier: existingUser.profileIdentifier || null,
  tempOtp: existingUser.tempOtp,
  isMobileNumberVerified: existingUser.isMobileNumberVerified,
  isEmailVerified: existingUser.isEmailVerified,
  token: existingUser.genToken(),
  //businessDetails: existingUser.businessDetails || null,
  accessManagement: existingUser.accessManagement || null,
  //clientTeam: existingUser.clientTeam || null,
  //timeShiftId: existingUser.timeShiftId || null,
  userAssociations: existingUser.userAssociations || null,
  associated: existingUser.associated || null,
  //aadharImage: existingUser.aadharImage,
  //consent: existingUser.consent,
  //verificationChecks: existingUser.verificationChecks || null,
});
exports.getUsers = async (query) => await User.findAll(query);

exports.getAllUser = async (query) => await User.findAndCountAll(query);
exports.getCount = async (query) => await User.count(query);

exports.getUser = async (query) => await User.findOne(query);
exports.getSuperAdmin = () => ({ id: 1 });
exports.createUser = async (data, associateId = null, loggedInUserId) => {
  try {
    const payload = {
      name: data.name,
      countryCode: data.countryCode,
      mobileNumber: data.mobileNumber,
      tempOtp: data.tempOtp || null,
      tempOtpExpiresAt: data.tempOtpExpiresAt || null,
      role: data.role,
      status: data.status || defaultStatus.PENDING,
      email: data.email || null,
      registrationPlatform: data.registrationPlatform || 'web',
      isMobileNumberVerified: data.isMobileNumberVerified || true,
      designation: data.designation || null,
      associateId,
      timeShiftId: data.timeShiftId || null,
      teamId: data.teamId || null,
      onboardingBase: data.onboardingBase,
      createdBy: loggedInUserId,
      verificationChecks: data.verificationChecks,
      customEmployeeId: data.customEmployeeId,
    };
    const user = await User.create(payload);
    user.profileIdentifier = `${transactionNumber + user.id}`;
    await user.save();
    return user;
  } catch (error) {
    throw new Error(error);
  }
};

exports.updateUser = async (query, data, logggedInUserId) => {
  try {
    const existingUser = await User.findOne(query);

    if (!existingUser) {
      return { success: false, message: errorMessage.DOES_NOT_EXIST('User') };
    }

    const sameUserQuery = {
      changes: { isEmail: false },
      query: [],
      hasChange: false,
    };

    if (
      (data.countryCode && data.countryCode !== existingUser.countryCode) ||
      (data.mobileNumber && data.mobileNumber !== existingUser.mobileNumber)
    ) {
      sameUserQuery.query.push({
        mobileNumber: data.mobileNumber,
        countryCode: data.countryCode,
      });
      existingUser.mobileNumber = data.mobileNumber;
      // existingUser.countryCode = data.countryCode; no need to update
      sameUserQuery.hasChange = true;
      sameUserQuery.changes.isEmail = false;
    }

    if (data.email && data.email !== existingUser.email) {
      sameUserQuery.query.push({
        email: data.email,
      });
      sameUserQuery.hasChange = true;

      existingUser.email = data.email;
      sameUserQuery.changes.isEmail = true;
    }

    if (sameUserQuery.hasChange) {
      const sameUser = await User.findOne({
        where: {
          [Op.or]: sameUserQuery.query,
        },
      });
      if (sameUser) {
        return {
          success: false,
          message: sameUserQuery.changes.isEmail
            ? errorMessage.ALREADY_EXIST('user with same email')
            : errorMessage.ALREADY_EXIST('user with same mobile number'),
        };
      }
    }

    existingUser.name = data.name || existingUser.name;
    existingUser.profilePicture =
      data.profilePicture || existingUser.profilePicture;
    existingUser.isGlobalAccess =
      data.isGlobalAccess || existingUser.isGlobalAccess;
    existingUser.designation = data.designation || null;
    existingUser.facialImage = data.facialImage || existingUser.facialImage;
    existingUser.timeShiftId = data.timeShiftId || existingUser.timeShiftId;
    existingUser.teamId = data.teamId || existingUser.teamId;
    existingUser.customEmployeeId = data.customEmployeeId;
    existingUser.onboardingBase =
      data.onboardingBase || existingUser.onboardingBase;
    existingUser.role = data.role || existingUser.role;
    existingUser.aadharImage = data.aadharImage || existingUser.aadharImage;
    if (data.associateId && data.associateId !== existingUser.associateId) {
      existingUser.associateId = data.associateId;
    }
    if (
      [usersRoles.EMPLOYEE, usersRoles.PROTO_OPERATION].includes(
        existingUser.role
      )
    ) {
      existingUser.verificationChecks =
        data.verificationChecks || existingUser.verificationChecks;
    }
    await existingUser.save();
    //this.synUser(existingUser.id).then();
    return { success: true, existingUser };
  } catch (e) {
    throw new Error(e);
  }
};

exports.findAndCountAll = async (query) => {
  try {
    return await User.findAndCountAll(query);
  } catch (e) {
    throw new Error(e);
  }
};

exports.findAll = async (query) => {
  try {
    return await User.findAll(query);
  } catch (e) {
    throw new Error(e);
  }
};
exports.patchUpdateStatus = async (
  existingUser,
  status,
  isDelete,
  loggedInUserId
) => {
  try {
    existingUser.status = status;
    if (isDelete) {
      existingUser.status = defaultStatus.DELETED;
      existingUser.mobileNumber = `${existingUser.mobileNumber}${Date.now()}'${
        defaultStatus.DELETED
      }'`;
      existingUser.email = `${existingUser.email}${Date.now()}'${
        defaultStatus.DELETED
      }'`;
      existingUser.updatedBy = loggedInUserId;
    }
    await existingUser.save();
    //this.synUser(existingUser.id).then();
    return existingUser;
  } catch (error) {
    throw new Error(error);
  }
};

exports.checkUser = async (
  existingUser,
  isEmail = false,
  tempOtp,
  headers = null,
  loggedInUserId
) => {
  if (parseInt(existingUser.tempOtp) !== parseInt(tempOtp)) {
    return { success: false, user: {} };
  }
  existingUser.deviceId = headers ? headers['deviceid'] : null;
  existingUser.tempOtp = null;
  existingUser.lastSignInAt = new Date();
  existingUser.tempOtpExpiresAt = null;
  if (isEmail) {
    existingUser.isEmailVerified = true;
  } else {
    existingUser.isMobileNumberVerified = true;
  }
  existingUser.updatedBy = loggedInUserId;
  await existingUser.save();
  return { success: true, user: existingUser };
};












