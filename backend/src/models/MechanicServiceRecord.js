const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MechanicServiceRecord = sequelize.define('MechanicServiceRecord', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mechanic_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  vehicle_type: {
    type: DataTypes.ENUM('Bus', 'Car', 'Van', 'Truck', 'Other'),
    allowNull: false
  },
  number_plate: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  problem_description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  spare_part_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  spare_part_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  service_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'mechanic_service_records',
  timestamps: true
});

module.exports = MechanicServiceRecord;
