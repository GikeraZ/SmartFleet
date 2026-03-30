const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SparePart = sequelize.define('SparePart', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  part_number: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  min_quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 5
  },
  unit: {
    type: DataTypes.STRING(20),
    defaultValue: 'piece'
  },
  cost_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  selling_price: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  supplier_name: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  supplier_contact: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'discontinued', 'out_of_stock'),
    defaultValue: 'active'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'spare_parts',
  timestamps: true
});

module.exports = SparePart;
