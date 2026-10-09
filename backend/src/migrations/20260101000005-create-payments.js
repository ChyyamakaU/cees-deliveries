'use strict';

const { PAYMENT_METHOD, PAYMENT_STATUS } = require('../utils/constants');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('payments', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      delivery_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'deliveries', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      reference: { type: Sequelize.STRING(40), allowNull: false, unique: true },
      amount: { type: Sequelize.DECIMAL(12, 2), allowNull: false },
      currency: { type: Sequelize.STRING(8), allowNull: false, defaultValue: 'NGN' },
      method: {
        type: Sequelize.ENUM(...Object.values(PAYMENT_METHOD)),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(...Object.values(PAYMENT_STATUS)),
        allowNull: false,
        defaultValue: PAYMENT_STATUS.PENDING,
      },
      transaction_id: { type: Sequelize.STRING(80), allowNull: true },
      paid_at: { type: Sequelize.DATE, allowNull: true },
      refunded_at: { type: Sequelize.DATE, allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.addIndex('payments', ['delivery_id'], { unique: true });
    await queryInterface.addIndex('payments', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('payments');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_payments_method";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_payments_status";');
  },
};
