'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('memories', {
      uuid: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        autoIncrementIdentity: true
      },
      name: Sequelize.STRING,
      occasion: Sequelize.STRING,
      experience: Sequelize.STRING,
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
    await queryInterface.dropTable('memories');
  }
};