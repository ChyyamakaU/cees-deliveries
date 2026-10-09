const { Model } = require('sequelize');
const { DELIVERY_STATUS } = require('../utils/constants');

module.exports = (sequelize, DataTypes) => {
  class DeliveryStatusHistory extends Model {
    static associate(models) {
      DeliveryStatusHistory.belongsTo(models.Delivery, {
        foreignKey: 'deliveryId',
        as: 'delivery',
      });

      DeliveryStatusHistory.belongsTo(models.User, {
        foreignKey: 'changedById',
        as: 'changedBy',
      });
    }
  }

  DeliveryStatusHistory.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      deliveryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'deliveries', key: 'id' },
      },
      status: {
        type: DataTypes.ENUM(...Object.values(DELIVERY_STATUS)),
        allowNull: false,
      },
      previousStatus: {
        type: DataTypes.ENUM(...Object.values(DELIVERY_STATUS)),
        allowNull: true,
      },
      changedById: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
      },
      note: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'DeliveryStatusHistory',
      tableName: 'delivery_status_histories',
      underscored: true,
      updatedAt: false,
      indexes: [{ fields: ['delivery_id'] }],
    }
  );

  return DeliveryStatusHistory;
};
