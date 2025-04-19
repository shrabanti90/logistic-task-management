const sequelize = require('sequelize');
const {
  usersRoles,
  errorMessage,
  defaultStatus,
} = require('../../../../config/options');
const OPTIONS = require('../../../../config/options');
const ErrorHandleHelper = require('../../../../models/helpers/ErrorHandleHelper');
const UserRepository = require('../../../../models/repositories/UserRepository');
const TaskRepository = require('../../../../models/repositories/TaskRepository');

const { customErrorLogger } = ErrorHandleHelper;
const { resCode } = OPTIONS;
const { Op } = sequelize;

exports.createTask = async (req, res) => {
  try {
    let { id } = req.user;
    const { id: loggedInUserId } = req.user;
   
      id = UserRepository.getSuperAdmin().id;
   
   

    const task = await TaskRepository.createTask(
      req.body,
      id,
      loggedInUserId
    );
    const message = OPTIONS.successMessage.ADD_SUCCESS_MESSAGE('Task');

    return res
      .status(resCode.HTTP_OK)
      .json(OPTIONS.genRes(resCode.HTTP_OK, { data: task, message }));
  } catch (e) {
    const error = OPTIONS.errorMessage.SERVER_ERROR;
    res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(OPTIONS.genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, error));
    throw new Error(e);
  }
};
exports.getTaskListing = async (req, res) => {
  try {
    const offset = parseInt(req.query.start) || 0;
    const limit = parseInt(req.query.limit) || 10;
    const { search, status, queryFilterName, taskStatus } = req.query;
    const whereQuery = {
      status: { [Op.not]: defaultStatus.DELETED },
      ...(taskStatus && {
        taskStatus,
      }),
    };
    if (search && search.length > 0) {
      if (queryFilterName && queryFilterName.length > 0) {
        whereQuery[Op.or] = {
          [queryFilterName]: { [Op.iLike]: `${search}%` },
        };
      } else {
        whereQuery[Op.or] = {
          name: { [Op.iLike]: `${search}%` },
          taskStatus: { [Op.iLike]: `${search}%` },
          description: { [Op.iLike]: `${search}%` },
        };
      }
    }
    if (status && !['all', 'null', 'undefined'].includes(status)) {
      whereQuery.status = status;
    }

    const query = {
      where: whereQuery,
      attributes: [
        'id',
        'name',
        'name',
        'taskstatus',
        'description'
      ],
      order: [['createdAt', 'DESC']],
      offset,
      limit,
      logging: console.log,
    };
    
    if (usersRoles.getAdminArray().includes(req.user.role)) {
      delete query.where['userId'];
      if (
        !['all', 'null', 'undefined'].includes(req.headers['clientid']) &&
        req.headers['clientid']
      ) {
        query.where['userId'] = req.headers.clientid;
      }
    }
    const tasks = await TaskRepository.getTaskListing(query);
    return res
      .status(resCode.HTTP_OK)
      .json(OPTIONS.genRes(resCode.HTTP_OK, { data: tasks }));
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
exports.getTask = async (req, res) => {
  try {
    const task = await TaskRepository.getTask({
      where: {
        id: req.params.id,
        status: { [Op.not]: OPTIONS.defaultStatus.DELETED },
      },
    });
    if (!task) {
      const error = OPTIONS.errorMessage.DOES_NOT_EXIST('Task');
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
      .json(OPTIONS.genRes(resCode.HTTP_OK, { data: task }));
  } catch (e) {
    const error = OPTIONS.errorMessage.SERVER_ERROR;
    res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(OPTIONS.genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, error));
    throw new Error(e);
  }
};
exports.putUpdateTask = async (req, res) => {
  try {
    const { id: loggedInUserId } = req.user;
    const query = {
      where: {
        id: req.params.id,
        status: { [Op.not]: OPTIONS.defaultStatus.DELETED },
      },
    };

    const task = await TaskRepository.getTask(query);

    if (!task) {
      const message = OPTIONS.errorMessage.DOES_NOT_EXIST('Task');
      return res
        .status(resCode.HTTP_BAD_REQUEST)
        .json(OPTIONS.genRes(resCode.HTTP_BAD_REQUEST, { message }));
    }

    await TaskRepository.putUpdateTask(task, req.body, loggedInUserId);
    let message = OPTIONS.successMessage.UPDATE_SUCCESS_MESSAGE('Task');
    return res
      .status(resCode.HTTP_OK)
      .json(OPTIONS.genRes(resCode.HTTP_OK, { data: task, message }));
  } catch (e) {
    customErrorLogger(e);
    const error = OPTIONS.errorMessage.SERVER_ERROR;
    res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(OPTIONS.genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, error));
    throw new Error(e);
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id: loggedInUserId } = req.user;
    const task = await TaskRepository.getTask({
      where: {
        id: req.params.id,
        status: { [Op.not]: OPTIONS.defaultStatus.DELETED },
      },
    });
    if (!task) {
      const error = OPTIONS.errorMessage.DOES_NOT_EXIST('Task');
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
    await TaskRepository.patchUpdateStatus(task, true, loggedInUserId);
    const message = OPTIONS.successMessage.DELETE_SUCCESS_MESSAGE('Task');
    return res
      .status(resCode.HTTP_OK)
      .json(OPTIONS.genRes(resCode.HTTP_OK, { message }));
  } catch (e) {
    const error = OPTIONS.errorMessage.SERVER_ERROR;
    res
      .status(resCode.HTTP_INTERNAL_SERVER_ERROR)
      .json(OPTIONS.genRes(resCode.HTTP_INTERNAL_SERVER_ERROR, error));
    throw new Error(e);
  }
};


