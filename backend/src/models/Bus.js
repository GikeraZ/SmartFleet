const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Bus = sequelize.define('Bus', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  plate_number: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  model: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  brand: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 50
  },
  status: {
    type: DataTypes.ENUM('active', 'maintenance', 'inactive'),
    defaultValue: 'active'
  },
  fuel_type: {
    type: DataTypes.ENUM('diesel', 'petrol', 'electric', 'hybrid'),
    defaultValue: 'diesel'
  },
  mileage: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  insurance_expiry: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  inspection_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  next_service_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  color: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  vin: {
    type: DataTypes.STRING(50),
    allowNull: true,
    unique: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'buses',
  timestamps: true
});

module.exports = Bus;
