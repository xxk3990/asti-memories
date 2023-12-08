'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('likes', {
      uuid: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        autoIncrementIdentity: true
      },
      memory_uuid: Sequelize.UUID,
      user_uuid: Sequelize.UUID,
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('likes');
  }
};