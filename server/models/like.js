'use strict';

const likeModel = (sequelize, DataTypes) => {
    const Like = sequelize.define('Like', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            autoIncrementIdentity: true
        },
        memory_uuid: DataTypes.UUID,
        user_uuid: DataTypes.UUID,
        },
        {
            sequelize,
            modelName: "Like",
            tableName: "likes",
            underscored: true
        }
    )
    return Like;
}

module.exports = {likeModel}