'use strict';

const { RIDER_AVAILABILITY, VEHICLE_TYPE } = require('../utils/constants');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rider_profiles', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      license_number: { type: Sequelize.STRING(60), allowNull: true, unique: true },
      vehicle_type: {
        type: Sequelize.ENUM(...Object.values(VEHICLE_TYPE)),
        allowNull: false,
        defaultValue: VEHICLE_TYPE.BIKE,
      },
      vehicle_plate_number: { type: Sequelize.STRING(30), allowNull: true },
      availability: {
        type: Sequelize.ENUM(...Object.values(RIDER_AVAILABILITY)),
        allowNull: false,
        defaultValue: RIDER_AVAILABILITY.OFFLINE,
      },
      is_verified: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      rating: { type: Sequelize.DECIMAL(3, 2), allowNull: false, defaultValue: 0 },
      total_deliveries: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      current_latitude: { type: Sequelize.DECIMAL(10, 7), allowNull: true },
      current_longitude: { type: Sequelize.DECIMAL(10, 7), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.addIndex('rider_profiles', ['availability']);
    await queryInterface.addIndex('rider_profiles', ['is_verified']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('rider_profiles');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_rider_profiles_vehicle_type";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_rider_profiles_availability";');
  },
};
