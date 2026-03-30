const { Contract, Invoice, Payment } = require('../models');
const { Op } = require('sequelize');

const getAllContracts = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { contract_number: { [Op.like]: `%${search}%` } },
        { client_name: { [Op.like]: `%${search}%` } }
      ];
    }
    if (status) where.status = status;

    const { count, rows } = await Contract.findAndCountAll({
      where,
      include: [
        { model: Invoice, as: 'invoices' },
        { model: Payment, as: 'payments' }
      ],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        contracts: rows,
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
      message: 'Error fetching contracts'
    });
  }
};

const getContractById = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id, {
      include: [
        { model: Invoice, as: 'invoices' },
        { model: Payment, as: 'payments' }
      ]
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    res.json({
      success: true,
      data: contract
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contract'
    });
  }
};

const createContract = async (req, res) => {
  try {
    const contract = await Contract.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Contract created successfully',
      data: contract
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating contract'
    });
  }
};

const updateContract = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    await contract.update(req.body);

    res.json({
      success: true,
      message: 'Contract updated successfully',
      data: contract
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating contract'
    });
  }
};

const deleteContract = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    await contract.destroy();

    res.json({
      success: true,
      message: 'Contract deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting contract'
    });
  }
};

const generateInvoice = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);
    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    const invoiceNumber = `INV-${Date.now()}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const invoice = await Invoice.create({
      invoice_number: invoiceNumber,
      contract_id: contract.id,
      client_name: contract.client_name,
      client_address: contract.client_address,
      issue_date: new Date(),
      due_date: dueDate,
      items: [{
        description: `Monthly service payment - ${contract.contract_number}`,
        quantity: 1,
        unit_price: contract.monthly_payment,
        total: contract.monthly_payment
      }],
      subtotal: contract.monthly_payment,
      tax: 0,
      total: contract.monthly_payment,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Invoice generated successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating invoice'
    });
  }
};

module.exports = {
  getAllContracts,
  getContractById,
  createContract,
  updateContract,
  deleteContract,
  generateInvoice
};
