const jwt = require('jsonwebtoken');
const OPTIONS = require('../config/options');
const jwtOPTIONS = require('../config/jwtOptions');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      countryCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      mobileNumber: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      email: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      apiKey: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      name: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      facialImage: {
        allowNull: true,
        type: DataTypes.TEXT,
        get() {
          return this.getDataValue('facialImage')
            ? JSON.parse(this.getDataValue('facialImage'))
            : null;
        },
        set(val) {
          if (val) {
            this.setDataValue('facialImage', JSON.stringify(val));
          }
        },
      },
      profileIdentifier: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      aadharImage: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      tempOtp: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      tempOtpExpiresAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      isMobileNumberVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastSignInAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      currentSignInIpAddress: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      registrationPlatform: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: OPTIONS.defaultStatus.PENDING,
      },
      verificationStatus: {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue: OPTIONS.verificationStatus.DID_NOT_VERIFY,
      },
      verifiedAt: {
        allowNull: true,
        type: DataTypes.DATE,
      },
     
      consent: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      consentDate: {
        allowNull: true,
        type: DataTypes.DATE,
      },
      joiningLink: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      isGlobalAccess: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      designation: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      isMobileChanged: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
      },
      isEmailChanged: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
      },
      onboardingBase: {
        allowNull: true,
        type: DataTypes.ENUM('self', 'protostaff', 'vendor','upload'),
      },
      timeShiftId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      teamId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
      deviceId: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      subscriptionId: {
        allowNull: true,
        type: DataTypes.INTEGER,
      },
     
      reasonOfDelete: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      verificationChecks: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      customEmployeeId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: true,
      freezeTableName: true,
    }
  );

  User.prototype.genToken = function (expiryTime = null) {
    const payload = { id: this.id };
    return jwt.sign(payload, jwtOPTIONS.secretOrKey, {
      expiresIn: expiryTime ? expiryTime : jwtOPTIONS.expiry,
    });
  };

  User.associate = (models) => {
   
    User.belongsTo(models.User, {
      foreignKey: 'associateId',
      as: 'associated',
    });
    User.hasMany(models.User, {
      foreignKey: 'associateId',
      as: 'associatedUsers',
    });
   
    User.hasMany(models.AccessManagement, {
      foreignKey: 'userId',
      as: 'accessManagement',
    });
    User.hasMany(models.UserAssociations, {
      foreignKey: 'userId',
      as: 'userAssociations',
    });
    User.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'createdByUser',
    });
    User.belongsTo(models.User, {
      foreignKey: 'updatedBy',
      as: 'updatedByUser',
    });
   
    
  };

  return User;
};
