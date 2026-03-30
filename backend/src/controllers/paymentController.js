const { Payment, Invoice, Contract } = require('../models');
const { Op } = require('sequelize');

const getAllPayments = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, startDate, endDate } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { payment_number: { [Op.like]: `%${search}%` } },
        { payer_name: { [Op.like]: `%${search}%` } }
      ];
    }
    if (startDate && endDate) {
      where.payment_date = { [Op.between]: [startDate, endDate] };
    }

    const { count, rows } = await Payment.findAndCountAll({
      where,
      include: [
        { model: Invoice, as: 'invoice' },
        { model: Contract, as: 'contract' }
      ],
      limit: parseInt(limit),
      offset,
      order: [['payment_date', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        payments: rows,
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
      message: 'Error fetching payments'
    });
  }
};

const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [
        { model: Invoice, as: 'invoice' },
        { model: Contract, as: 'contract' }
      ]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payment'
    });
  }
};

const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating payment'
    });
  }
};

const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    if (payment.invoice_id) {
      const invoice = await Invoice.findByPk(payment.invoice_id);
      if (invoice) {
        const newAmountPaid = invoice.amount_paid - payment.amount;
        let newStatus = 'partial';
        if (newAmountPaid <= 0) {
          newStatus = 'pending';
        } else if (newAmountPaid >= invoice.total) {
          newStatus = 'paid';
        }

        await invoice.update({
          amount_paid: Math.max(0, newAmountPaid),
          status: newStatus
        });
      }
    }

    await payment.destroy();

    res.json({
      success: true,
      message: 'Payment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting payment'
    });
  }
};

const getPaymentSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const where = {};
    if (startDate && endDate) {
      where.payment_date = { [Op.between]: [startDate, endDate] };
    }

    const total = await Payment.sum('amount', { where }) || 0;

    const byMethod = await Payment.findAll({
      where,
      attributes: [
        'payment_method',
        [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'total']
      ],
      group: ['payment_method']
    });

    res.json({
      success: true,
      data: {
        total: parseFloat(total),
        byMethod
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment summary'
    });
  }
};

module.exports = {
  getAllPayments,
  getPaymentById,
  createPayment,
  deletePayment,
  getPaymentSummary
};
