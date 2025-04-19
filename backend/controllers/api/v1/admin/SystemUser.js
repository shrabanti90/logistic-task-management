const sequelize = require('sequelize');
const { usersRoles, defaultStatus } = require('../../../../config/options');
const OPTIONS = require('../../../../config/options');
const {
  AccessManagement,
  User,
  BusinessDetails,
} = require('../../../../models');
const ErrorHandleHelper = require('../../../../models/helpers/ErrorHandleHelper');
const SystemUserRepository = require('../../../../models/repositories/SystemUserRepository');
const UserRepository = require('../../../../models/repositories/UserRepository');

const { customErrorLogger } = ErrorHandleHelper;
const { resCode } = OPTIONS;
const { Op } = sequelize;

exports.createSystemUser = async (req, res) => {
  try {
    const { id: loggedInUserId } = req.user;
    const systemUser = await SystemUserRepository.createSystemUser(
      req.body,
      loggedInUserId
    );

    if (systemUser.success) {
      return res.status(resCode.HTTP_OK).json(
        OPTIONS.genRes(resCode.HTTP_OK, {
          data: systemUser.data,
          message: systemUser.message,
        })
      );
    }

    return res.status(resCode.HTTP_BAD_REQUEST).json(
      OPTIONS.genRes(resCode.HTTP_BAD_REQUEST, {
        message: systemUser.message,
      })
    );
  } catch (e) {
    const error = OPTIONS.errorMessage.SERVER_ERROR;
    res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(OPTIONS.genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, error));
    throw new Error(e);
  }
};
exports.getSystemUser = async (req, res) => {
  try {
    const systemUser = await UserRepository.getUser({
      where: {
        id: req.params.id,
        role: [
          usersRoles.PROTO_ADMIN,
          usersRoles.PROTO_USER,
          usersRoles.ON_BOARDER,
          usersRoles.PROTO_LAWYER,
          usersRoles.PROTO_OPERATION,
        ],
      },
      include: [
        {
          model: AccessManagement,
          as: 'accessManagement',
          attributes: ['id', 'delete', 'edit', 'type', 'view', 'add'],
        },
        {
          model: User,
          as: 'userClient',
          attributes: ['id'],
          through: { attributes: [] },
        },
      ],
    });
    if (!systemUser) {
      const error = OPTIONS.errorMessage.DOES_NOT_EXIST('data');
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(
          OPTIONS.genRes(
            resCode.HTTP_BAD_REQUEST,
            error,
            OPTIONS.errorTypes.INPUT_VALIDATION
          )
        );
    }
    return res
      .status(resCode.HTTP_OK)
      .json(OPTIONS.genRes(resCode.HTTP_OK, { data: systemUser }));
  } catch (e) {
    const error = OPTIONS.errorMessage.SERVER_ERROR;
    res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(OPTIONS.genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, error));
    throw new Error(e);
  }
};
exports.getSystemUserListing = async (req, res) => {
  try {
    const offset = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const { search, status } = req.query;
    const role = [
      usersRoles.PROTO_ADMIN,
      usersRoles.PROTO_USER,
      usersRoles.ON_BOARDER,
      usersRoles.PROTO_LAWYER,
      usersRoles.PROTO_OPERATION,
    ];
    const whereQuery = {
      role,
      status: { [Op.not]: defaultStatus.DELETED },
    };
    if (
      search &&
      search.length > 0 &&
      !['all', 'null', 'undefined'].includes(search)
    ) {
      whereQuery[Op.or] = {
        name: { [Op.iLike]: `${search}%` },
        email: { [Op.iLike]: `${search}%` },
        mobileNumber: { [Op.iLike]: `${search}%` },
      };
    }
    if (status && !['all', 'null', 'undefined'].includes(status)) {
      whereQuery.status = status;
    }
    const query = {
      where: whereQuery,
      attributes: [
        'id',
        'name',
        'email',
        'countryCode',
        'mobileNumber',
        'role',
        'status',
        'createdAt',
        'updatedAt',
        'designation',
      ],
      include: [
        {
          model: User,
          as: 'userClient',
          attributes: ['id', 'name'],
          through: { attributes: [] },
          include: [
            {
              model: BusinessDetails,
              as: 'businessDetails',
              attributes: ['registeredName', 'type'],
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit,
    };

    const systemUsers = await UserRepository.getAllUser(query);
    return res
      .status(resCode.HTTP_OK)
      .json(OPTIONS.genRes(resCode.HTTP_OK, { data: systemUsers }));
  } catch (e) {
    customErrorLogger(e);
    return res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(
        OPTIONS.genRes(
          resCode.HTTP_INTERNAL_SERVER_ERROR,
          OPTIONS.errorMessage.SERVER_ERROR
        )
      );
  }
};
exports.putUpdateSystemUser = async (req, res) => {
  try {
    const { id: loggedInUserId } = req.user;
    const payloadSystemUser = await SystemUserRepository.putUpdateSystemUser(
      req.params.id,
      req.body,
      loggedInUserId
    );
    let message = OPTIONS.successMessage.UPDATE_SUCCESS_MESSAGE('Member');
    if (!payloadSystemUser.success) {
      message = OPTIONS.errorMessage.DOES_NOT_EXIST('member');
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(OPTIONS.genRes(resCode.HTTP_BAD_REQUEST, { message }));
    }
    return res.status(resCode.HTTP_OK).json(
      OPTIONS.genRes(resCode.HTTP_OK, {
        data: payloadSystemUser.existingUser,
        message,
      })
    );
  } catch (e) {
    customErrorLogger(e);
    const error = OPTIONS.errorMessage.SERVER_ERROR;
    res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(OPTIONS.genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, error));
    throw new Error(e);
  }
};
exports.patchChangeStatusSystemUser = async (req, res) => {
  try {
    const { id: loggedInUserId } = req.user;
    const systemUser = await UserRepository.getUser({
      where: {
        id: req.params.id,
        status: { [Op.not]: OPTIONS.defaultStatus.DELETED },
        role: [
          usersRoles.PROTO_ADMIN,
          usersRoles.PROTO_USER,
          usersRoles.ON_BOARDER,
          usersRoles.PROTO_LAWYER,
        ],
      },
    });
    if (!systemUser) {
      const error = OPTIONS.errorMessage.DOES_NOT_EXIST('member');
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(
          OPTIONS.genRes(
            resCode.HTTP_BAD_REQUEST,
            error,
            OPTIONS.errorTypes.INPUT_VALIDATION
          )
        );
    }
    const status =
      systemUser.status === defaultStatus.ACTIVE
        ? defaultStatus.BLOCKED
        : defaultStatus.ACTIVE;
    await SystemUserRepository.patchUpdateStatus(
      systemUser,
      status,
      false,
      loggedInUserId
    );
    const message = OPTIONS.successMessage.UPDATE_SUCCESS_MESSAGE('Member');
    return res.json(OPTIONS.genRes(resCode.HTTP_OK, { message }));
  } catch (e) {
    const errors = OPTIONS.errorMessage.SERVER_ERROR;
    res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(OPTIONS.genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, errors));
    throw new Error(e);
  }
};
