const OPTIONS = require('../config/options');

module.exports = (sequelize, DataTypes) => {
  const UserAssociations = sequelize.define(
    'UserAssociations',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      sitesId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      regionId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      isGlobal: {
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

  UserAssociations.associate = (models) => {
    UserAssociations.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
    UserAssociations.belongsTo(models.User, {
      foreignKey: 'reportingManagerId',
      as: 'reportingManager',
    });
    UserAssociations.belongsTo(models.User, {
      foreignKey: 'onBoardingManagerId',
      as: 'onBoardingManager',
    });

    UserAssociations.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'createdByUser',
    });
    UserAssociations.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updatedByUser',
    });
  };

  return UserAssociations;
};
