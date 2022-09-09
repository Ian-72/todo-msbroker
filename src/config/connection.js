require('dotenv').config();

const connection = {
  host: process.env.HOST || 'localhost',
  port: process.env.PORT || 8080,
};

module.exports = connection;
