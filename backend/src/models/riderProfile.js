const { Model } = require('sequelize');
const { RIDER_AVAILABILITY, VEHICLE_TYPE } = require('../utils/constants');

module.exports = (sequelize, DataTypes) => {
  class RiderProfile extends Model {
    static associate(models) {
      RiderProfile.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }

    /** A rider can only receive new jobs while online and verified. */
    isAvailableForAssignment() {
      return (
        this.availability === RIDER_AVAILABILITY.AVAILABLE &&
        this.isVerified === true
      );
    }
  }

  RiderProfile.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'users', key: 'id' },
      },
      licenseNumber: {
        type: DataTypes.STRING(60),
        allowNull: true,
        unique: true,
      },
      vehicleType: {
        type: DataTypes.ENUM(...Object.values(VEHICLE_TYPE)),
        allowNull: false,
        defaultValue: VEHICLE_TYPE.BIKE,
      },
      vehiclePlateNumber: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      availability: {
        type: DataTypes.ENUM(...Object.values(RIDER_AVAILABILITY)),
        allowNull: false,
        defaultValue: RIDER_AVAILABILITY.OFFLINE,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0,
      },
      totalDeliveries: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      currentLatitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
      currentLongitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'RiderProfile',
      tableName: 'rider_profiles',
      underscored: true,
      indexes: [
        { fields: ['availability'] },
        { fields: ['is_verified'] },
      ],
    }
  );

  return RiderProfile;
};
