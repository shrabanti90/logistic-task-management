const jwt = require('jsonwebtoken');
const sequelize = require('sequelize');
const getIp = require('ipware')().get_ip;
const { User, Task, UserPastOrganization,ReferenceCheck, UserAssociations } = require('..');
const ErrorHandleHelper = require('./ErrorHandleHelper');
const {
  usersRoles,
  resCode,
  genRes,
  errorTypes,
  defaultStatus,
  successMessage,
  errorMessage,
} = require('../../config/options');
const OPTIONS = require('../../config/options');
const { sixMonthExpiry } = require("../../config/options");
const TaskRepository = require('../repositories/TaskRepository');
const { customErrorLogger } = ErrorHandleHelper;
const { Op } = sequelize;
const aesKey = process.env.PG_AES_KEY;


const hasRole = (user, roles) => {
  if (roles && roles.length) {
    return [usersRoles.PROTO_SUPER_ADMIN].includes(user.role)
      ? true
      : roles.indexOf(user.role) > -1;
  }
  return false;
};
exports.authenticateJWT = function (roles, force = true) {
  return function (req, res, next) {
    const secretOrKey = process.env.JWT_SECRET_KEY;
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      jwt.verify(token, secretOrKey, async (err, jwtPayload) => {
        if (err) {
          customErrorLogger(err);
          return res
            .status(resCode.HTTP_UNAUTHORIZED)
            .json(
              genRes(resCode.HTTP_UNAUTHORIZED, errorTypes.UNAUTHORIZED_ACCESS)
            );
        }
        if (jwtPayload && jwtPayload.id) {
          const existingUser = await User.findOne({
            where: {
              id: jwtPayload.id,
              status: { [Op.notIn]: [defaultStatus.DELETED] },
            },
            include: [
              {
                model: UserAssociations,
                as: 'userAssociations',
                where: { status: defaultStatus.ACTIVE },
                required: false,
                attributes: [
                  'status',
                  'regionId',
                  'sitesId',
                  'reportingManagerId',
                  'onBoardingManagerId',
                ],
              },
            ],
          });
          if (existingUser && hasRole(existingUser, roles)) {
            req.authenticated = true;
            req.user = existingUser;
            next();
          } else {
            return res
              .status(resCode.HTTP_UNAUTHORIZED)
              .json(
                genRes(
                  resCode.HTTP_UNAUTHORIZED,
                  errorTypes.UNAUTHORIZED_ACCESS
                )
              );
          }
        } else if (!force) {
          next();
        } else {
          return res
            .status(resCode.HTTP_FORBIDDEN)
            .json(genRes(resCode.HTTP_FORBIDDEN, errorTypes.FORBIDDEN));
        }
      });
    } else if (!force) {
      next();
    } else {
      return res
        .status(resCode.HTTP_UNAUTHORIZED)
        .json(
          genRes(resCode.HTTP_UNAUTHORIZED, errorTypes.UNAUTHORISED_ACCESS)
        );
    }
  };
};

exports.verifyTaskToken = () => {
  return function (req, res, next) {
    const secretOrKey = process.env.JWT_SECRET_KEY;
    const token = req.params.token;
    if (token) {
      jwt.verify(token, secretOrKey, async (err, jwtPayload) => {
        console.log(jwtPayload);
        if (err) {
          customErrorLogger(err);
          return res
            .status(resCode.HTTP_UNAUTHORIZED)
            .json(
              genRes(resCode.HTTP_UNAUTHORIZED, errorTypes.UNAUTHORIZED_ACCESS)
            );
        }
        if (jwtPayload && jwtPayload.id) {
          const existingTask = await Task.findOne({
            where: {
              id: jwtPayload.id,
              status: defaultStatus.PENDING,
            },
          });
          if (existingTask) {
            await TaskRepository.patchUpdateStatus(
              existingTask,
              defaultStatus.APPROVED,
              false
            );
            const message = successMessage.VERIFIED_SUCCESS_MESSAGE('Task');
            return res.json(genRes(resCode.HTTP_OK, { message }));
          } else {
            return res.json(
              genRes(resCode.HTTP_NO_CONTENT, { message: 'Already verified' })
            );
          }
        } else {
          return res
            .status(resCode.HTTP_FORBIDDEN)
            .json(genRes(resCode.HTTP_FORBIDDEN, errorTypes.FORBIDDEN));
        }
      });
    } else {
      return res
        .status(resCode.HTTP_UNAUTHORIZED)
        .json(
          genRes(resCode.HTTP_UNAUTHORIZED, errorTypes.UNAUTHORISED_ACCESS)
        );
    }
  };
};
exports.verifyUserToken = () => {
  return function (req, res, next) {
    const secretOrKey = process.env.JWT_SECRET_KEY;
    const token = req.params.token;
    if (token) {
      jwt.verify(token, secretOrKey, async (err, jwtPayload) => {
        console.log(jwtPayload);
        if (err) {
          customErrorLogger(err);
          return res
            .status(resCode.HTTP_UNAUTHORIZED)
            .json(
              genRes(resCode.HTTP_UNAUTHORIZED, errorTypes.UNAUTHORIZED_ACCESS)
            );
        }
        if (jwtPayload && jwtPayload.id) {
          const existingUser = await User.findOne({
            where: {
              id: jwtPayload.id,
              status: { [Op.not]: defaultStatus.DELETED },
            },
            attributes: ['id', 'email', 'name', 'status', 'isEmailVerified'],
          });
          let renderPayload = {
            line1: `Hello ${existingUser.name},`,
            line2: `Please use the link below to verify your email.`,
            line3: `If you have any questions, please don't hesitate to contact us at`,
            line4: `support@protostaff.com`,
            line5: `Thank you,`,
            line6: `Team Protostaff`,
            logo: `${process.env.BACKEND_URL}/protostaff-logo-black.png`,
            linkedin_logo: `${process.env.BACKEND_URL}/assets/linkedin.png`,
          };
          if (existingUser && existingUser.status === defaultStatus.BLOCKED) {
            renderPayload.line2 = errorMessage.USER_ACCOUNT_BLOCKED;
          } else if (existingUser && !existingUser.isEmailVerified) {
            existingUser.isEmailVerified = true;
            await existingUser.save();
            renderPayload.email_logo = `${process.env.BACKEND_URL}/assets/email-verification-success.png`;
            renderPayload.line2 = successMessage.VERIFIED('email is');
          } else if (existingUser && existingUser.isEmailVerified) {
            renderPayload.line2 = successMessage.VERIFIED('email was already');
          } else {
            renderPayload.line2 = errorMessage.NOT_AUTHORIZED;
          }
          return res.render('verified-email', renderPayload);
        } else {
          return res
            .status(resCode.HTTP_FORBIDDEN)
            .json(genRes(resCode.HTTP_FORBIDDEN, errorTypes.FORBIDDEN));
        }
      });
    } else {
      return res
        .status(resCode.HTTP_UNAUTHORIZED)
        .json(
          genRes(resCode.HTTP_UNAUTHORIZED, errorTypes.UNAUTHORISED_ACCESS)
        );
    }
  };
};

exports.verifyUserPastOrganization = () => {
  return function (req, res, next) {
    const secretOrKey = process.env.JWT_SECRET_KEY;
    const token = req.params.token;
    if (token) {
      jwt.verify(token, secretOrKey, async (err, jwtPayload) => {
        if (err) {
          customErrorLogger(err);
          return res
            .status(resCode.HTTP_UNAUTHORIZED)
            .json(
              genRes(resCode.HTTP_UNAUTHORIZED, errorTypes.UNAUTHORIZED_ACCESS)
            );
        }
        if (jwtPayload && jwtPayload.id) {
          const existingUser = await UserPastOrganization.findOne({
            where: {
              id: jwtPayload.id,
              // status: { [Op.not]: defaultStatus.DELETED },
            },
            attributes: {
              exclude: ['userId', 'organizationId', 'createdBy', 'updatedBy'],
            },
          });
          if (existingUser) {
            req.query.id = existingUser.id;
            next();
          } else {
            return res
              .status(resCode.HTTP_UNAUTHORIZED)
              .json(
                genRes(
                  resCode.HTTP_UNAUTHORIZED,
                  errorTypes.UNAUTHORIZED_ACCESS
                )
              );
          }
        } else {
          return res
            .status(resCode.HTTP_FORBIDDEN)
            .json(genRes(resCode.HTTP_FORBIDDEN, errorTypes.FORBIDDEN));
        }
      });
    } else {
      return res
        .status(resCode.HTTP_UNAUTHORIZED)
        .json(
          genRes(resCode.HTTP_UNAUTHORIZED, errorTypes.UNAUTHORISED_ACCESS)
        );
    }
  };
};

exports.verifyUserReferenceCheck = () => {
  return function (req, res, next) {
    const secretOrKey = process.env.JWT_SECRET_KEY;
    const token = req.params.token;
    if (token) {
      jwt.verify(token, secretOrKey, async (err, jwtPayload) => {
        if (err) {
          customErrorLogger(err);
          return res
            .status(resCode.HTTP_UNAUTHORIZED)
            .json(
              genRes(resCode.HTTP_UNAUTHORIZED, errorTypes.UNAUTHORIZED_ACCESS)
            );
        }
        if (jwtPayload && jwtPayload.id) {
          const existingUser = await ReferenceCheck.findOne({
            where: {
              id: jwtPayload.id,
              // status: { [Op.not]: defaultStatus.DELETED },
            },
            attributes: {
              exclude: ['userId', 'createdBy', 'updatedBy'],
            },
          });
          if (existingUser) {
            req.query.id = existingUser.id;
            next();
          } else {
            return res
              .status(resCode.HTTP_UNAUTHORIZED)
              .json(
                genRes(
                  resCode.HTTP_UNAUTHORIZED,
                  errorTypes.UNAUTHORIZED_ACCESS
                )
              );
          }
        } else {
          return res
            .status(resCode.HTTP_FORBIDDEN)
            .json(genRes(resCode.HTTP_FORBIDDEN, errorTypes.FORBIDDEN));
        }
      });
    } else {
      return res
        .status(resCode.HTTP_UNAUTHORIZED)
        .json(
          genRes(resCode.HTTP_UNAUTHORIZED, errorTypes.UNAUTHORISED_ACCESS)
        );
    }
  };
};

exports.authenticateAPIKey = function (roles, force = true) {
  return async function (req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      if (authHeader) {
        const apiKey = authHeader.split('API-KEY ')[1];
        if (apiKey) {
          const existingUser = await User.findOne({
            where: {
              [Op.and]: [
                sequelize.literal(
                  `PGP_SYM_DECRYPT("apiKey"::bytea, '${aesKey}') IN ('${apiKey}')`
                ),
              ],
              status: { [Op.notIn]: [defaultStatus.DELETED] },
            },
            attributes: [
              'id',
              'role',
              [
                sequelize.fn(
                  'PGP_SYM_DECRYPT',
                  sequelize.cast(sequelize.col('apiKey'), 'bytea'),
                  aesKey
                ),
                'apiKey',
              ],
            ]
          });
          if (existingUser) {
            req.authenticated = true;
            req.user = existingUser;
            req.user.token = req.user.genToken(sixMonthExpiry);
            return next();
          } else {
            return res.status(resCode.HTTP_UNAUTHORIZED).json(genRes(resCode.HTTP_UNAUTHORIZED, errorTypes.UNAUTHORIZED_ACCESS));
          }
        } else if (!force) {
          return next();
        } else {
          return res.status(resCode.HTTP_FORBIDDEN).json(genRes(resCode.HTTP_FORBIDDEN, errorTypes.FORBIDDEN));
        }
       }
    } catch (error) {
      console.error('Error in authenticateAPIKey middleware:', error);
      return res.status(resCode.HTTP_INTERNAL_SERVER_ERROR).json(genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, errorTypes.SERVER_ERROR));
    }
  };
};




