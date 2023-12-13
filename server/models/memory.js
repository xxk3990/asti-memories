'use strict';

const memoryModel = (sequelize, DataTypes) => {
    const Memory = sequelize.define('Memory', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            autoIncrementIdentity: true
        },
        user_uuid: DataTypes.UUID,
        occasion: DataTypes.STRING,
        experience: DataTypes.STRING,
        num_likes: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: "Memory",
            tableName: "memories",
            underscored: true
        }
    )
    return Memory;
}

module.exports = {memoryModel}