const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Vehicle = sequelize.define('Vehicle', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  registration_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  client_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  client_phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  client_email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  vehicle_type: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  make: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  model: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  vin: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  mileage: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  fuel_type: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  color: {
    type: DataTypes.STRING(30),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'under_service', 'completed', 'delivered'),
    defaultValue: 'active'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'vehicles',
  timestamps: true
});

module.exports = Vehicle;
