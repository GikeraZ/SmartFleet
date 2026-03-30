const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TripReport = sequelize.define('TripReport', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  driver_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bus_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  farm_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  trip_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  departure_time: {
    type: DataTypes.TIME,
    allowNull: false
  },
  arrival_time: {
    type: DataTypes.TIME,
    allowNull: true
  },
  bus_condition_before: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  bus_condition_after: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  fuel_before: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  fuel_after: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'trip_reports',
  timestamps: true
});

module.exports = TripReport;
