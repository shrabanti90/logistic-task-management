const sequelize = require('sequelize');
const { Task } = require('..');

const {
  defaultStatus,
} = require('../../config/options');

exports.getTask = async (query) => {
  try {
    return await Task.findOne(query);
  } catch (error) {
    throw new Error(error);
  }
};

exports.getTaskListing = async (query) => {
  try {
    return await Task.findAndCountAll(query);
  } catch (error) {
    throw new Error(error);
  }
};

exports.createTask = async (data, userId, loggedInUserId) => {
  try {
    const payload = {
      name: data.name,
      description: data.description,
      taskStatus: data.taskStatus,
      createdBy: loggedInUserId,
    };
    const task = await Task.create(payload);
    return task;
  } catch (error) {
    throw new Error(error);
  }
};

exports.putUpdateTask = async (existingTask, body, loggedInUserId) => {
  try {
    existingTask.name = body.name;
    existingTask.description = body.companyName;
    existingTask.taskStatus = body.taskStatus;
      existingTask.updatedBy = loggedInUserId;
    await existingTask.save();
  } catch (error) {
    throw new Error(error);
  }
};






