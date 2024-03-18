'use strict';

const imageModel = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            autoIncrementIdentity: true
        },
        memory_uuid: DataTypes.UUID,
        user_uuid: DataTypes.UUID,
        image_key: DataTypes.STRING,
        image_caption: DataTypes.STRING,
        source_bucket: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: "Image",
            tableName: "images",
            underscored: true
        }
    )
    return Image;
}

module.exports = {imageModel}