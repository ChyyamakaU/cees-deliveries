'use strict';

const { ROLES, USER_STATUS } = require('../utils/constants');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      first_name: { type: Sequelize.STRING(80), allowNull: false },
      last_name: { type: Sequelize.STRING(80), allowNull: false },
      email: { type: Sequelize.STRING(160), allowNull: false, unique: true },
      phone: { type: Sequelize.STRING(30), allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      role: {
        type: Sequelize.ENUM(...Object.values(ROLES)),
        allowNull: false,
        defaultValue: ROLES.CUSTOMER,
      },
      status: {
        type: Sequelize.ENUM(...Object.values(USER_STATUS)),
        allowNull: false,
        defaultValue: USER_STATUS.ACTIVE,
      },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('now') },
    });

    await queryInterface.addIndex('users', ['role']);
    await queryInterface.addIndex('users', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('users');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_role";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_status";');
  },
};
