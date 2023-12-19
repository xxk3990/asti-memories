'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('admins', {
            uuid: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                autoIncrementIdentity: true
            },
            email: Sequelize.STRING,
            display_name: Sequelize.STRING,
            password: Sequelize.STRING,
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
        await queryInterface.dropTable('admins');
    }
};