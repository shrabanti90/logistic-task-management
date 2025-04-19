const jwt = require('jsonwebtoken');
const OPTIONS = require('../config/options');
const jwtOPTIONS = require('../config/jwtOptions');

module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      taskStatus: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: OPTIONS.defaultStatus.PENDING,
      },
      status: {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue: OPTIONS.defaultStatus.PENDING,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );

  Task.prototype.genToken = function () {
    const payload = { id: this.id };
    return jwt.sign(payload, jwtOPTIONS.secretOrKey);
  };

  Task.associate = (models) => {
    Task.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'createdByUser',
    });
    Task.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updatedByUser',
    });
  };

  return Task;
};
