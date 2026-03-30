const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Contract = sequelize.define('Contract', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  contract_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  client_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  client_email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  client_phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  client_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  service_type: {
    type: DataTypes.ENUM('transport', 'garage', 'both'),
    defaultValue: 'transport'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  monthly_payment: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total_value: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'terminated', 'pending'),
    defaultValue: 'active'
  },
  terms: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'contracts',
  timestamps: true
});

module.exports = Contract;
