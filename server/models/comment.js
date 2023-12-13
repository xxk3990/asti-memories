'use strict';

const commentModel = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            autoIncrementIdentity: true
        },
        memory_uuid: DataTypes.UUID,
        user_uuid: DataTypes.UUID,
        comment_text: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Comment",
            tableName: "comments",
            underscored: true
        }
    )
    return Comment;
}

module.exports = {commentModel}