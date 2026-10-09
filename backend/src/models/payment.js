const { Model } = require('sequelize');
const { PAYMENT_METHOD, PAYMENT_STATUS } = require('../utils/constants');

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) {
      Payment.belongsTo(models.Delivery, {
        foreignKey: 'deliveryId',
        as: 'delivery',
      });
    }

    isSettled() {
      return this.status === PAYMENT_STATUS.SUCCESSFUL;
    }
  }

  Payment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      deliveryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'deliveries', key: 'id' },
      },
      reference: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true,
      },
      amount: {
        type: DataTypes.DECIMAL(12, 2),
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING(8),
        allowNull: false,
        defaultValue: 'NGN',
      },
      method: {
        type: DataTypes.ENUM(...Object.values(PAYMENT_METHOD)),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(...Object.values(PAYMENT_STATUS)),
        allowNull: false,
        defaultValue: PAYMENT_STATUS.PENDING,
      },
      transactionId: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      paidAt: { type: DataTypes.DATE, allowNull: true },
      refundedAt: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      modelName: 'Payment',
      tableName: 'payments',
      underscored: true,
      indexes: [
        { fields: ['delivery_id'], unique: true },
        { fields: ['status'] },
      ],
      hooks: {
        beforeValidate: (payment) => {
          if (!payment.reference) {
            const random = Math.random().toString(36).slice(2, 8).toUpperCase();
            payment.reference = `PAY-${Date.now().toString(36).toUpperCase()}-${random}`;
          }
        },
      },
    }
  );

  return Payment;
};
