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
    "username": null,
    "password": null,
    "database": "asti_memories_test",
    "host": "localhost",
    "dialect": "postgres"
  },
  "production": {
    "username": "postgres",
    "password": process.env.RDS_PASSWORD,
    "database": "asti_memories_rds",
    "host": "asti-memories.cg6tsyf9mgr3.us-east-2.rds.amazonaws.com",
    "dialect": "postgres"
  }
}