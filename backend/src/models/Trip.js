const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  route_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  driver_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bus_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  trip_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  departure_time: {
    type: DataTypes.TIME,
    allowNull: true
  },
  arrival_time: {
    type: DataTypes.TIME,
    allowNull: true
  },
  passengers_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  fuel_consumed: {
    type: DataTypes.DECIMAL(8, 2),
    defaultValue: 0
  },
  distance_covered: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('scheduled', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'scheduled'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'trips',
  timestamps: true
});

module.exports = Trip;
