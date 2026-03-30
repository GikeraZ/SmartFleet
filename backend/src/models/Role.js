const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Role = sequelize.define('Role', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  display_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  permissions: {
    type: DataTypes.JSON,
    defaultValue: {}
  }
}, {
  tableName: 'roles',
  timestamps: true
});

module.exports = Role;
