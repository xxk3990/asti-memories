'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('images', {
            uuid: {
                type: Sequelize.UUID,
                primaryKey: true,
                allowNull: false,
                autoIncrementIdentity: true
            },
            memory_uuid: Sequelize.UUID,
            user_uuid: Sequelize.UUID,
            memory_uuid: {
                type: Sequelize.STRING,
                allowNull: true, //can be null if the image comes from the family
            },
            user_uuid: Sequelize.UUID,
            image_name: Sequelize.STRING,
            image_caption: Sequelize.STRING,
            family_image: Sequelize.BOOLEAN,
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
        await queryInterface.dropTable('images');
    }
};