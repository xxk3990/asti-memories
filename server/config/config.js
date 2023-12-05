const dotenv = require('dotenv');

dotenv.config();
module.exports = {
  "development": {
    "username": null,
    "password": null,
    "database": "asti_memories",
    "host": "localhost",
    "dialect": "postgres"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "localhost",
    "dialect": "postgres"
  },
  "production": {
    "username": "postgres",
    "password": "",
    "database": "asti_memories",
    "host": "",
    "dialect": "postgres"
  }
}