'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const process = require("process")
const environment = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../config/config.js`)[environment];
const db = {};
const bcrypt = require("bcrypt");
const {memoryModel} = require("./memory")
const {userModel} = require("./user")
const {commentModel} = require("./comment")
const {imageModel} = require("./image")

const sequelize = new Sequelize(config.database, config.username, config.password, {
  dialect: 'postgres',
  host: 'localhost',
})

const models = {
  Memory: memoryModel(sequelize, Sequelize.DataTypes),
  User: userModel(sequelize, Sequelize.DataTypes),
  Comment: commentModel(sequelize, Sequelize.DataTypes),
  Image: imageModel(sequelize, Sequelize.DataTypes)
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(() => {
    for(const m of Object.values(models)) {
      db[m.name] = m;
    }
    // .forEach(model => {
     
    // })
    
  });


models.Memory.belongsTo(models.User, {
  as: "posted_by",
  foreignKey: "user_uuid"
})

models.Memory.hasMany(models.Comment, {
  as: "comments",
  foreignKey: "memory_uuid"
})

models.Comment.belongsTo(models.User, {
  as: "commenter_name",
  foreignKey: "user_uuid"
})

models.Image.belongsTo(models.User, {
  as: "uploader_name",
  foreignKey: 'user_uuid'
})

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
