'use strict';

const imageModel = (sequelize, DataTypes) => {
    const Image = sequelize.define('Image', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            autoIncrementIdentity: true
        },
        memory_uuid: {
            type: DataTypes.STRING,
            allowNull: true, //can be null if the image comes from the family
        },
        user_uuid: DataTypes.UUID,
        image_url: DataTypes.STRING,
        image_caption: DataTypes.STRING,
        family_image: DataTypes.BOOLEAN,
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