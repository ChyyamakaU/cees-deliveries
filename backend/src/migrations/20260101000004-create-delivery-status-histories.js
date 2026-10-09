'use strict';

const { DELIVERY_STATUS } = require('../utils/constants');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('delivery_status_histories', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      delivery_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'deliveries', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM(...Object.values(DELIVERY_STATUS)),
        allowNull: false,
      },
      previous_status: {
        type: Sequelize.ENUM(...Object.values(DELIVERY_STATUS)),
        allowNull: true,
      },
      changed_by_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      note: { type: Sequelize.STRING(255), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.addIndex('delivery_status_histories', ['delivery_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('delivery_status_histories');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_delivery_status_histories_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_delivery_status_histories_previous_status";');
  },
};
