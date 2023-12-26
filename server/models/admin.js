'use strict';

const adminModel = (sequelize, DataTypes) => {
    const Admin = sequelize.define('Admin', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            autoIncrementIdentity: true
        },
        email: DataTypes.STRING,
        display_name: DataTypes.STRING,
        password: DataTypes.STRING,

    }, {
        sequelize,
        modelName: "Admin",
        tableName: "admins",
        underscored: true
    })
    return Admin;
}

module.exports = {
    adminModel
}