const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PartUsage = sequelize.define('PartUsage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  service_record_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  spare_part_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  quantity_used: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'part_usage',
  timestamps: true
});

module.exports = PartUsage;
