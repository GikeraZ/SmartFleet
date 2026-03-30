const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ServiceRecord = sequelize.define('ServiceRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  service_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  service_type: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mechanic_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  parts_used: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  labor_hours: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  labor_cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  parts_cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total_cost: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  service_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  completion_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'delivered'),
    defaultValue: 'pending'
  },
  warranty: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'service_records',
  timestamps: true
});

module.exports = ServiceRecord;
