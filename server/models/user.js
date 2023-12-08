'use strict';

const userModel = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            autoIncrementIdentity: true
        },
        display_name: DataTypes.STRING,
    }, {
        sequelize,
        modelName: "User",
        tableName: "users",
        underscored: true
    })
    return User;
}

module.exports = {
    userModel
}