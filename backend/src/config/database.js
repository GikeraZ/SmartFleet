const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true
    }
  }
);

const createDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    });
    
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    await connection.end();
    console.log(`Database '${process.env.DB_NAME}' ensured`);
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
};

module.exports = sequelize;
module.exports.createDatabase = createDatabase;
