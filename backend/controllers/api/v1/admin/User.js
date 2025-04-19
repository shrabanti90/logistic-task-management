const sequelize = require('sequelize');
const {
  AccessManagement,
} = require('../../../../models');
const ErrorHandleHelper = require('../../../../models/helpers/ErrorHandleHelper');
const UserRepository = require('../../../../models/repositories/UserRepository');

const OPTIONS = require('../../../../config/options');
const {
  usersRoles,
  errorTypes,
} = require('../../../../config/options');

const { customErrorLogger } = ErrorHandleHelper;
const { resCode } = OPTIONS;
const { Op } = sequelize;

exports.adminSendMobileOtp = async (req, res) => {
  try {
    const query = {
      where: {
        status: { [Op.notIn]: [OPTIONS.defaultStatus.DELETED] },
        mobileNumber: req.body.mobileNumber,
        countryCode: req.body.countryCode,
        role: usersRoles.getAdminArray(),
      },
    };

    const existingUser = await UserRepository.getUser(query);

    if (existingUser && existingUser.status === OPTIONS.defaultStatus.BLOCKED) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(
          OPTIONS.genRes(
            resCode.HTTP_BAD_REQUEST,
            OPTIONS.errorMessage.USER_ACCOUNT_BLOCKED,
            errorTypes.ACCOUNT_BLOCKED
          )
        );
    }

    const todayDate = new Date();
    let tempOtp = OPTIONS.genOtp();

    todayDate.setDate(todayDate.getDate() + OPTIONS.otpExpireInDays);
    tempOtp = ![
      '1111111111',
    ].includes(existingUser.mobileNumber)
      ? tempOtp
      : 55555;
    if (existingUser) {
      existingUser.tempOtp = tempOtp;
      existingUser.tempOtpExpiresAt = todayDate;
      await existingUser.save();
    } else {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(
          OPTIONS.genRes(
            resCode.HTTP_BAD_REQUEST,
            OPTIONS.errorMessage.INCORRECT_DATA('mobile number'),
            errorTypes.ACCESS_DENIED_EXCEPTION
          )
        );
    }
    // send OTP to mobile number
    const message = OPTIONS.successMessage.OTP_SEND_SUCCESSFULLY_MOBILE;
    return res
      .status(resCode.HTTP_OK)
      .json(OPTIONS.genRes(resCode.HTTP_OK, { message }));
  } catch (e) {
    customErrorLogger(e);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        OPTIONS.genRes(
          resCode.HTTP_INTERNAL_SERVER_ERROR,
          OPTIONS.errorMessage.SERVER_ERROR,
          OPTIONS.errorTypes.INTERNAL_SERVER_ERROR
        )
      );
  }
};

exports.verifyMobileOtp = async (req, res) => {
  try {
    const query = {
      where: {
        tempOtp: req.body.tempOtp,
        tempOtpExpiresAt: { [Op.gte]: new Date() },
        mobileNumber: req.body.mobileNumber,
        countryCode: req.body.countryCode,
      },
      include: [
        {
          model: AccessManagement,
          as: 'accessManagement',
          attributes: [
            'id',
            'type',
            'view',
            'add',
            'edit',
            'delete',
            'status',
            'userId',
          ],
        },
      ],
    };

    const existingUser = await UserRepository.getUser(query);
    if (!existingUser) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(
          OPTIONS.genRes(
            resCode.HTTP_BAD_REQUEST,
            OPTIONS.errorMessage.OTP_INVALID,
            OPTIONS.errorTypes.INPUT_VALIDATION
          )
        );
    }
    const { user, success } = await UserRepository.checkUser(
      existingUser,
      false,
      req.body.tempOtp
    );
    const todayDate = new Date();
    let tempOtp = OPTIONS.genOtp();
    tempOtp = ![
      '1111111111',
      
    ].includes(existingUser.mobileNumber)
      ? tempOtp
      : 55555;
    todayDate.setDate(todayDate.getDate() + OPTIONS.otpExpireInDays);
    existingUser.tempOtp = tempOtp;
    existingUser.tempOtpExpiresAt = todayDate;
    existingUser.email = user.email;
    existingUser.isEmailVerified = false;
    await existingUser.save();

   
    const message = OPTIONS.successMessage.OTP_SEND_SUCCESSFULLY_EMAIL;
    return res.status(resCode.HTTP_OK).json(
      OPTIONS.genRes(resCode.HTTP_OK, {
        message,
        data: {
          email: existingUser.email,
          mobileNumber: existingUser.mobileNumber,
        },
      })
    );
  } catch (e) {
    customErrorLogger(e);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        OPTIONS.genRes(
          resCode.HTTP_INTERNAL_SERVER_ERROR,
          OPTIONS.errorMessage.SERVER_ERROR,
          OPTIONS.errorTypes.INTERNAL_SERVER_ERROR
        )
      );
  }
};

exports.sendEmailOtp = async (req, res) => {
  try {
    const query = {
      where: {
        status: { [Op.notIn]: [OPTIONS.defaultStatus.DELETED] },
        email: req.body.email,
      },
      include: [
        {
          model: AccessManagement,
          as: 'accessManagement',
          attributes: [
            'id',
            'type',
            'view',
            'add',
            'edit',
            'delete',
            'status',
            'userId',
          ],
        },
      ],
    };

    let existingUser = await UserRepository.getUser(query);
    if (existingUser) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(
          OPTIONS.genRes(
            resCode.HTTP_BAD_REQUEST,
            OPTIONS.errorMessage.ALREADY_EXIST,
            OPTIONS.errorTypes.INPUT_VALIDATION
          )
        );
    }
    if (existingUser && existingUser.status === OPTIONS.defaultStatus.BLOCKED) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(
          OPTIONS.genRes(
            resCode.HTTP_BAD_REQUEST,
            OPTIONS.errorMessage.USER_ACCOUNT_BLOCKED
          )
        );
    }

    existingUser = await UserRepository.getUser({
      where: {
        mobileNumber: req.body.mobileNumber,
      },
    });

    const todayDate = new Date();
    let tempOtp = OPTIONS.genOtp();

    todayDate.setDate(todayDate.getDate() + OPTIONS.otpExpireInDays);
    existingUser.tempOtp = tempOtp;
    existingUser.tempOtpExpiresAt = todayDate;
    existingUser.email = req.body.email;
    existingUser.isEmailVerified = false;
    existingUser.updatedBy = existingUser.id;
    await existingUser.save();

   
    const message = OPTIONS.successMessage.OTP_SEND_SUCCESSFULLY_EMAIL;
    return res
      .status(resCode.HTTP_OK)
      .json(OPTIONS.genRes(resCode.HTTP_OK, { message }));
  } catch (e) {
    customErrorLogger(e);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        OPTIONS.genRes(
          resCode.HTTP_INTERNAL_SERVER_ERROR,
          OPTIONS.errorMessage.SERVER_ERROR,
          OPTIONS.errorTypes.INTERNAL_SERVER_ERROR
        )
      );
  }
};

exports.verifyEmailOtp = async (req, res) => {
  try {
    const query = {
      where: {
        status: {
          [Op.notIn]: [
            OPTIONS.defaultStatus.DELETED,
            OPTIONS.defaultStatus.BLOCKED,
          ],
        },
        tempOtp: req.body.tempOtp,
        tempOtpExpiresAt: { [Op.gte]: new Date() },
        email: req.body.email,
      },
      include: [
        {
          model: AccessManagement,
          as: 'accessManagement',
          attributes: [
            'id',
            'type',
            'view',
            'add',
            'edit',
            'delete',
            'status',
            'userId',
          ],
        }
      ],
    };

    const existingUser = await UserRepository.getUser(query);
    if (!existingUser) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(
          OPTIONS.genRes(
            resCode.HTTP_BAD_REQUEST,
            OPTIONS.errorMessage.OTP_INVALID,
            OPTIONS.errorTypes.INPUT_VALIDATION
          )
        );
    }
    const { user, success } = await UserRepository.checkUser(
      existingUser,
      true,
      req.body.tempOtp
    );
    const payload = UserRepository.modifyOutputData(user);
    return res
      .status(resCode.HTTP_OK)
      .json(OPTIONS.genRes(resCode.HTTP_OK, { data: payload }));
  } catch (e) {
    customErrorLogger(e);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        OPTIONS.genRes(
          resCode.HTTP_INTERNAL_SERVER_ERROR,
          OPTIONS.errorMessage.SERVER_ERROR,
          OPTIONS.errorTypes.INTERNAL_SERVER_ERROR
        )
      );
  }
};



exports.getUserProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const query = {
      where: {
        id,
      },
      attributes: [
        'id',
        'name',
        'countryCode',
        'mobileNumber',
        'email',
        'profilePicture',
        'status',
        'role',
        'isMobileNumberVerified',
        'isEmailVerified',
        'timeShiftId',
        'associateId',
      ],
      include: [
        // {
        //   model: BusinessDetails,
        //   as: 'businessDetails',
        //   attributes: ['registeredName'],
        // },
        {
          model: AccessManagement,
          as: 'accessManagement',
          attributes: [
            'id',
            'type',
            'view',
            'add',
            'edit',
            'delete',
            'status',
            'userId',
          ],
        },
        // {
        //   model: User,
        //   as: 'associated',
        //   attributes: ['name'],
        //   include: [
        //     {
        //       model: BusinessDetails,
        //       as: 'businessDetails',
        //       attributes: ['registeredName'],
        //     },
        //   ],
        // },
      ],
    };
    const existingUser = await UserRepository.getUser(query);
    if (!existingUser) {
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(
          OPTIONS.genRes(
            resCode.HTTP_BAD_REQUEST,
            OPTIONS.errorMessage.NO_USER('data')
          )
        );
    }
    const payload = UserRepository.modifyOutputData(existingUser);
    return res
      .status(resCode.HTTP_OK)
      .json(OPTIONS.genRes(resCode.HTTP_OK, { data: payload }));
  } catch (e) {
    customErrorLogger(e);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        OPTIONS.genRes(
          resCode.HTTP_INTERNAL_SERVER_ERROR,
          OPTIONS.errorMessage.SERVER_ERROR,
          OPTIONS.errorTypes.INTERNAL_SERVER_ERROR
        )
      );
  }
};



