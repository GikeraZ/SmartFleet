const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Driver = sequelize.define('Driver', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  license_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  license_expiry: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  license_type: {
    type: DataTypes.STRING(20),
    defaultValue: 'Class D'
  },
  bus_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  salary: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  hire_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  emergency_contact: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  emergency_phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'on_leave'),
    defaultValue: 'active'
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 5.00
  },
  total_trips: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'drivers',
  timestamps: true
});

module.exports = Driver;
