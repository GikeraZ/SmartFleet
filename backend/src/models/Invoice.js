const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  invoice_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  contract_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  client_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  client_address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  issue_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  due_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  items: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  tax: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  amount_paid: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('pending', 'paid', 'partial', 'overdue', 'cancelled'),
    defaultValue: 'pending'
  },
  payment_date: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  payment_method: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'invoices',
  timestamps: true
});

module.exports = Invoice;
