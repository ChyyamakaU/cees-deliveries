const { Model } = require('sequelize');
const { DELIVERY_STATUS, PACKAGE_SIZE, NON_CANCELLABLE_STATUSES } = require('../utils/constants');

module.exports = (sequelize, DataTypes) => {
  class Delivery extends Model {
    static associate(models) {
      Delivery.belongsTo(models.User, {
        foreignKey: 'customerId',
        as: 'customer',
      });

      Delivery.belongsTo(models.User, {
        foreignKey: 'riderId',
        as: 'rider',
      });

      Delivery.hasMany(models.DeliveryStatusHistory, {
        foreignKey: 'deliveryId',
        as: 'statusHistory',
        onDelete: 'CASCADE',
      });

      Delivery.hasOne(models.Payment, {
        foreignKey: 'deliveryId',
        as: 'payment',
        onDelete: 'CASCADE',
      });
    }

    /** Terminal states are protected from further mutation. */
    isFinal() {
      return NON_CANCELLABLE_STATUSES.includes(this.status);
    }

    canBeCancelled() {
      return !this.isFinal();
    }
  }

  Delivery.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      trackingCode: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      customerId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
      },
      riderId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
      },
      status: {
        type: DataTypes.ENUM(...Object.values(DELIVERY_STATUS)),
        allowNull: false,
        defaultValue: DELIVERY_STATUS.PENDING,
      },

      pickupLabel: { type: DataTypes.STRING(120), allowNull: false },
      pickupAddress: { type: DataTypes.STRING(255), allowNull: false },
      pickupContactName: { type: DataTypes.STRING(120), allowNull: false },
      pickupContactPhone: { type: DataTypes.STRING(30), allowNull: false },
      pickupLatitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
      pickupLongitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },

      dropoffLabel: { type: DataTypes.STRING(120), allowNull: false },
      dropoffAddress: { type: DataTypes.STRING(255), allowNull: false },
      dropoffContactName: { type: DataTypes.STRING(120), allowNull: false },
      dropoffContactPhone: { type: DataTypes.STRING(30), allowNull: false },
      dropoffLatitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },
      dropoffLongitude: { type: DataTypes.DECIMAL(10, 7), allowNull: true },

      packageDescription: { type: DataTypes.STRING(255), allowNull: false },
      packageSize: {
        type: DataTypes.ENUM(...Object.values(PACKAGE_SIZE)),
        allowNull: false,
        defaultValue: PACKAGE_SIZE.SMALL,
      },
      packageWeight: { type: DataTypes.DECIMAL(8, 2), allowNull: true },

      distanceKm: { type: DataTypes.DECIMAL(8, 2), allowNull: false, defaultValue: 0 },
      deliveryFee: { type: DataTypes.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      currency: { type: DataTypes.STRING(8), allowNull: false, defaultValue: 'NGN' },

      scheduledPickupAt: { type: DataTypes.DATE, allowNull: true },
      notes: { type: DataTypes.TEXT, allowNull: true },
      cancellationReason: { type: DataTypes.STRING(255), allowNull: true },

      confirmedAt: { type: DataTypes.DATE, allowNull: true },
      assignedAt: { type: DataTypes.DATE, allowNull: true },
      pickedUpAt: { type: DataTypes.DATE, allowNull: true },
      inTransitAt: { type: DataTypes.DATE, allowNull: true },
      deliveredAt: { type: DataTypes.DATE, allowNull: true },
      cancelledAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Delivery',
      tableName: 'deliveries',
      underscored: true,
      indexes: [
        { fields: ['status'] },
        { fields: ['customer_id'] },
        { fields: ['rider_id'] },
        { fields: ['tracking_code'], unique: true },
      ],
      hooks: {
        beforeValidate: (delivery) => {
          if (!delivery.trackingCode) {
            const random = Math.random().toString(36).slice(2, 8).toUpperCase();
            delivery.trackingCode = `CD-${Date.now().toString(36).toUpperCase()}-${random}`;
          }
        },
      },
    }
  );

  return Delivery;
};
