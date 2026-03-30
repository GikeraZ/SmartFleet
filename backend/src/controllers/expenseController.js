const { Expense, Bus, Driver } = require('../models');
const { Op } = require('sequelize');

const getAllExpenses = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, status, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { expense_number: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    if (category) where.category = category;
    if (status) where.status = status;
    if (startDate && endDate) {
      where.expense_date = { [Op.between]: [startDate, endDate] };
    }

    const { count, rows } = await Expense.findAndCountAll({
      where,
      include: [
        { model: Bus, as: 'bus' },
        { model: Driver, as: 'driver' }
      ],
      limit: parseInt(limit),
      offset,
      order: [['expense_date', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        expenses: rows,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expenses'
    });
  }
};

const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id, {
      include: [
        { model: Bus, as: 'bus' },
        { model: Driver, as: 'driver' }
      ]
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    res.json({
      success: true,
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expense'
    });
  }
};

const createExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating expense'
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    await expense.update(req.body);

    res.json({
      success: true,
      message: 'Expense updated successfully',
      data: expense
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating expense'
    });
  }
};

const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByPk(req.params.id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    await expense.destroy();

    res.json({
      success: true,
      message: 'Expense deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting expense'
    });
  }
};

const getExpenseSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.expense_date = { [Op.between]: [startDate, endDate] };
    }
    where.status = 'approved';

    const summary = await Expense.findAll({
      where,
      attributes: [
        'category',
        [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'total']
      ],
      group: ['category']
    });

    const total = await Expense.sum('amount', { where }) || 0;

    res.json({
      success: true,
      data: {
        byCategory: summary,
        total: parseFloat(total)
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching expense summary'
    });
  }
};

module.exports = {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseSummary
};
