'use strict';

const eventModel = (sequelize, DataTypes) => {
    const Event = sequelize.define('Event', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            autoIncrementIdentity: true
        },
        year: DataTypes.INTEGER,
        description: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "event",
            tableName: "events",
            underscored: true
        }
    )
    return Event;
}

module.exports = {eventModel}