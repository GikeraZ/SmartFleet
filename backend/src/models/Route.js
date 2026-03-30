const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Route = sequelize.define('Route', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  origin: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  destination: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  pickup_points: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  distance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  estimated_duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  shift: {
    type: DataTypes.ENUM('morning', 'evening', 'night'),
    defaultValue: 'morning'
  },
  departure_time: {
    type: DataTypes.TIME,
    allowNull: true
  },
  return_time: {
    type: DataTypes.TIME,
    allowNull: true
  },
  driver_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  bus_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  worker_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive'),
    defaultValue: 'active'
  },
  fare_per_trip: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'routes',
  timestamps: true
});

module.exports = Route;
