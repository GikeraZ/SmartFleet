const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  payment_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  invoice_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  contract_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  payment_method: {
    type: DataTypes.ENUM('cash', 'bank_transfer', 'check', 'card'),
    defaultValue: 'cash'
  },
  reference_number: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  payer_name: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'payments',
  timestamps: true
});

module.exports = Payment;
