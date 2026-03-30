const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  expense_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  category: {
    type: DataTypes.ENUM('fuel', 'salary', 'maintenance', 'repairs', 'insurance', 'supplies', 'utilities', 'other'),
    defaultValue: 'other'
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  expense_date: {
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
  bus_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  driver_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  receipt_path: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'paid'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'expenses',
  timestamps: true
});

module.exports = Expense;
