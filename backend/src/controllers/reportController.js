const { Payment, Expense, Invoice, Contract, Trip } = require('../models');
const { Op } = require('sequelize');
const PDFDocument = require('pdfkit');

const generateFinancialReport = async (req, res) => {
  try {
    const { startDate, endDate, type } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter = { [Op.between]: [startDate, endDate] };
    }

    let report = {};

    if (type === 'income' || !type) {
      const incomeData = await getIncomeReport(dateFilter);
      report.income = incomeData;
    }

    if (type === 'expense' || !type) {
      const expenseData = await getExpenseReport(dateFilter);
      report.expenses = expenseData;
    }

    if (type === 'profit' || !type) {
      report.profitLoss = await getProfitLossReport(dateFilter);
    }

    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating financial report'
    });
  }
};

async function getIncomeReport(dateFilter) {
  const where = dateFilter.startDate ? { payment_date: dateFilter } : {};

  const transportIncome = await Payment.findAll({
    where: { ...where, contract_id: { [Op.ne]: null } },
    include: [{ model: Contract, as: 'contract' }]
  });

  const garageIncome = await Invoice.findAll({
    where: {
      ...(dateFilter.startDate ? { issue_date: dateFilter } : {}),
      status: { [Op.in]: ['paid', 'partial'] }
    }
  });

  const totalTransport = transportIncome.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  const totalGarage = garageIncome.reduce((sum, i) => sum + parseFloat(i.total), 0);

  return {
    transport: {
      total: totalTransport,
      payments: transportIncome
    },
    garage: {
      total: totalGarage,
      invoices: garageIncome
    },
    grandTotal: totalTransport + totalGarage
  };
}

async function getExpenseReport(dateFilter) {
  const where = dateFilter.startDate ? { expense_date: dateFilter, status: 'approved' } : { status: 'approved' };

  const expenses = await Expense.findAll({
    where,
    attributes: [
      'category',
      [require('sequelize').fn('SUM', require('sequelize').col('amount')), 'total']
    ],
    group: ['category']
  });

  const total = await Expense.sum('amount', { where }) || 0;

  return {
    byCategory: expenses,
    total: parseFloat(total)
  };
}

async function getProfitLossReport(dateFilter) {
  const income = await getIncomeReport(dateFilter);
  const expenses = await getExpenseReport(dateFilter);

  return {
    totalIncome: income.grandTotal,
    totalExpenses: expenses.total,
    netProfit: income.grandTotal - expenses.total,
    profitMargin: income.grandTotal > 0 
      ? ((income.grandTotal - expenses.total) / income.grandTotal * 100).toFixed(2) 
      : 0
  };
}

const downloadReportPDF = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter = { [Op.between]: [startDate, endDate] };
    }

    const income = await getIncomeReport(dateFilter);
    const expenses = await getExpenseReport(dateFilter);
    const profitLoss = await getProfitLossReport(dateFilter);

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=financial-report-${Date.now()}.pdf`);
    doc.pipe(res);

    doc.fontSize(20).text('SmartFleet Pro', { align: 'center' });
    doc.fontSize(16).text('Financial Report', { align: 'center' });
    if (startDate && endDate) {
      doc.fontSize(12).text(`Period: ${startDate} to ${endDate}`, { align: 'center' });
    }
    doc.moveDown(2);

    doc.fontSize(14).text('Income Summary', { underline: true });
    doc.fontSize(12);
    doc.text(`Transport Income: $${income.transport.total.toFixed(2)}`);
    doc.text(`Garage Income: $${income.garage.total.toFixed(2)}`);
    doc.moveDown();
    doc.fontSize(14).text(`Total Income: $${income.grandTotal.toFixed(2)}`, { bold: true });
    doc.moveDown(2);

    doc.fontSize(14).text('Expense Summary', { underline: true });
    doc.fontSize(12);
    if (expenses.byCategory.length > 0) {
      expenses.byCategory.forEach(exp => {
        doc.text(`${exp.category}: $${parseFloat(exp.dataValues.total).toFixed(2)}`);
      });
    }
    doc.moveDown();
    doc.fontSize(14).text(`Total Expenses: $${expenses.total.toFixed(2)}`, { bold: true });
    doc.moveDown(2);

    doc.fontSize(16).text('Profit & Loss Summary', { underline: true });
    doc.fontSize(14);
    doc.text(`Net Profit: $${profitLoss.netProfit.toFixed(2)}`, { bold: true });
    doc.text(`Profit Margin: ${profitLoss.profitMargin}%`);
    doc.moveDown(2);

    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, { align: 'right' });

    doc.end();
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating PDF report'
    });
  }
};

const exportToCSV = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter = { [Op.between]: [startDate, endDate] };
    }

    let data;
    let filename;

    switch (type) {
      case 'expenses':
        data = await Expense.findAll({ where: dateFilter.startDate ? { expense_date: dateFilter } : {} });
        filename = 'expenses';
        break;
      case 'payments':
        data = await Payment.findAll({ where: dateFilter.startDate ? { payment_date: dateFilter } : {} });
        filename = 'payments';
        break;
      case 'invoices':
        data = await Invoice.findAll({ where: dateFilter.startDate ? { issue_date: dateFilter } : {} });
        filename = 'invoices';
        break;
      default:
        data = [];
    }

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No data found for export'
      });
    }

    const headers = Object.keys(data[0].toJSON()).join(',');
    const rows = data.map(item => Object.values(item.toJSON()).join(','));
    const csv = [headers, ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}-${Date.now()}.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error exporting data'
    });
  }
};

module.exports = {
  generateFinancialReport,
  downloadReportPDF,
  exportToCSV
};
