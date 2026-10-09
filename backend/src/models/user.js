const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
const { ROLES, USER_STATUS } = require('../utils/constants');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    async comparePassword(plainPassword) {
      if (!this.password) return false;
      return bcrypt.compare(plainPassword, this.password);
    }

    static associate(models) {
      User.hasOne(models.RiderProfile, {
        foreignKey: 'userId',
        as: 'riderProfile',
        onDelete: 'CASCADE',
      });

      User.hasMany(models.Delivery, {
        foreignKey: 'customerId',
        as: 'customerDeliveries',
      });

      User.hasMany(models.Delivery, {
        foreignKey: 'riderId',
        as: 'riderDeliveries',
      });

      User.hasMany(models.DeliveryStatusHistory, {
        foreignKey: 'changedById',
        as: 'statusChanges',
      });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(160),
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
      phone: {
        type: DataTypes.STRING(30),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM(...Object.values(ROLES)),
        allowNull: false,
        defaultValue: ROLES.CUSTOMER,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(USER_STATUS)),
        allowNull: false,
        defaultValue: USER_STATUS.ACTIVE,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      defaultScope: {
        attributes: { exclude: ['password'] },
      },
      scopes: {
        withPassword: {
          attributes: { include: ['password'] },
        },
      },
      hooks: {
        beforeSave: async (user) => {
          if (user.changed('password')) {
            const rounds = 10;
            user.password = await bcrypt.hash(user.password, rounds);
          }
        },
      },
    }
  );

  return User;
};
