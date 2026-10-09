'use strict';

const { DELIVERY_STATUS, PACKAGE_SIZE } = require('../utils/constants');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('deliveries', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      tracking_code: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      rider_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      status: {
        type: Sequelize.ENUM(...Object.values(DELIVERY_STATUS)),
        allowNull: false,
        defaultValue: DELIVERY_STATUS.PENDING,
      },

      pickup_label: { type: Sequelize.STRING(120), allowNull: false },
      pickup_address: { type: Sequelize.STRING(255), allowNull: false },
      pickup_contact_name: { type: Sequelize.STRING(120), allowNull: false },
      pickup_contact_phone: { type: Sequelize.STRING(30), allowNull: false },
      pickup_latitude: { type: Sequelize.DECIMAL(10, 7), allowNull: true },
      pickup_longitude: { type: Sequelize.DECIMAL(10, 7), allowNull: true },

      dropoff_label: { type: Sequelize.STRING(120), allowNull: false },
      dropoff_address: { type: Sequelize.STRING(255), allowNull: false },
      dropoff_contact_name: { type: Sequelize.STRING(120), allowNull: false },
      dropoff_contact_phone: { type: Sequelize.STRING(30), allowNull: false },
      dropoff_latitude: { type: Sequelize.DECIMAL(10, 7), allowNull: true },
      dropoff_longitude: { type: Sequelize.DECIMAL(10, 7), allowNull: true },

      package_description: { type: Sequelize.STRING(255), allowNull: false },
      package_size: {
        type: Sequelize.ENUM(...Object.values(PACKAGE_SIZE)),
        allowNull: false,
        defaultValue: PACKAGE_SIZE.SMALL,
      },
      package_weight: { type: Sequelize.DECIMAL(8, 2), allowNull: true },

      distance_km: { type: Sequelize.DECIMAL(8, 2), allowNull: false, defaultValue: 0 },
      delivery_fee: { type: Sequelize.DECIMAL(12, 2), allowNull: false, defaultValue: 0 },
      currency: { type: Sequelize.STRING(8), allowNull: false, defaultValue: 'NGN' },

      scheduled_pickup_at: { type: Sequelize.DATE, allowNull: true },
      notes: { type: Sequelize.TEXT, allowNull: true },
      cancellation_reason: { type: Sequelize.STRING(255), allowNull: true },

      confirmed_at: { type: Sequelize.DATE, allowNull: true },
      assigned_at: { type: Sequelize.DATE, allowNull: true },
      picked_up_at: { type: Sequelize.DATE, allowNull: true },
      in_transit_at: { type: Sequelize.DATE, allowNull: true },
      delivered_at: { type: Sequelize.DATE, allowNull: true },
      cancelled_at: { type: Sequelize.DATE, allowNull: true },

      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.addIndex('deliveries', ['status']);
    await queryInterface.addIndex('deliveries', ['customer_id']);
    await queryInterface.addIndex('deliveries', ['rider_id']);
    await queryInterface.addIndex('deliveries', ['tracking_code'], { unique: true });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('deliveries');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_deliveries_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_deliveries_package_size";');
  },
};
