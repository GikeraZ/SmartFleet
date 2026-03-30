const { Invoice, Contract, Payment } = require('../models');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');

const getAllInvoices = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;

    const where = {};
    if (search) {
      where[Op.or] = [
        { invoice_number: { [Op.like]: `%${search}%` } },
        { client_name: { [Op.like]: `%${search}%` } }
      ];
    }
    if (status) where.status = status;

    const { count, rows } = await Invoice.findAndCountAll({
      where,
      include: [{ model: Contract, as: 'contract' }],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: {
        invoices: rows,
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
      message: 'Error fetching invoices'
    });
  }
};

const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [
        { model: Contract, as: 'contract' },
        { model: Payment, as: 'payments' }
      ]
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.json({
      success: true,
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching invoice'
    });
  }
};

const createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Invoice created successfully',
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating invoice'
    });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    await invoice.update(req.body);

    res.json({
      success: true,
      message: 'Invoice updated successfully',
      data: invoice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating invoice'
    });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    await invoice.destroy();

    res.json({
      success: true,
      message: 'Invoice deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting invoice'
    });
  }
};

const recordPayment = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    const { amount, payment_method, reference_number, notes } = req.body;

    const payment = await Payment.create({
      payment_number: `PAY-${Date.now()}`,
      invoice_id: invoice.id,
      contract_id: invoice.contract_id,
      amount,
      payment_date: new Date(),
      payment_method: payment_method || 'cash',
      reference_number,
      notes
    });

    const newAmountPaid = parseFloat(invoice.amount_paid) + parseFloat(amount);
    let newStatus = 'partial';
    if (newAmountPaid >= invoice.total) {
      newStatus = 'paid';
    }

    await invoice.update({
      amount_paid: newAmountPaid,
      status: newStatus,
      payment_date: new Date(),
      payment_method
    });

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully',
      data: { invoice, payment }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording payment'
    });
  }
};

const generatePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.id, {
      include: [{ model: Contract, as: 'contract' }]
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoice.invoice_number}.pdf`);
    doc.pipe(res);

    doc.fontSize(24).text('INVOICE', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Invoice Number: ${invoice.invoice_number}`);
    doc.text(`Date: ${invoice.issue_date}`);
    doc.text(`Due Date: ${invoice.due_date}`);
    doc.text(`Status: ${invoice.status.toUpperCase()}`);
    doc.moveDown();

    doc.text('Bill To:', { underline: true });
    doc.text(invoice.client_name);
    if (invoice.client_address) doc.text(invoice.client_address);
    doc.moveDown();

    doc.text('Items:', { underline: true });
    doc.moveDown(0.5);
    
    if (invoice.items && invoice.items.length > 0) {
      invoice.items.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.description}`);
        doc.text(`   Quantity: ${item.quantity}, Unit Price: $${item.unit_price}, Total: $${item.total}`);
      });
    }
    doc.moveDown();

    doc.text(`Subtotal: $${invoice.subtotal}`);
    doc.text(`Tax: $${invoice.tax}`);
    doc.fontSize(14).text(`Total: $${invoice.total}`, { bold: true });
    doc.fontSize(12).text(`Amount Paid: $${invoice.amount_paid}`);
    doc.text(`Balance Due: $${parseFloat(invoice.total) - parseFloat(invoice.amount_paid)}`);

    if (invoice.notes) {
      doc.moveDown();
      doc.text('Notes:', { underline: true });
      doc.text(invoice.notes);
    }

    doc.moveDown(2);
    doc.fontSize(10).text('Thank you for your business!', { align: 'center' });
    doc.text('SmartFleet Pro - Fleet & Garage Management', { align: 'center' });

    doc.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF'
    });
  }
};

module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  recordPayment,
  generatePDF
};
