const OPTIONS = require('../config/options');

module.exports = (sequelize, DataTypes) => {
  const AccessManagement = sequelize.define(
    'AccessManagement',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      type: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      view: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      add: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      edit: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      delete: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: OPTIONS.defaultStatus.ACTIVE,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );

  AccessManagement.associate = (models) => {
    AccessManagement.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    AccessManagement.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'createdBy',
    });

    AccessManagement.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'updatedBy',
    });
  };

  return AccessManagement;
};
