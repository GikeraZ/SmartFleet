const { Op } = require('sequelize');
const { User, Role, Bus, Driver, Route, Trip, Contract, Invoice, Vehicle, ServiceRecord, SparePart, Expense, Payment, sequelize } = require('../models');

const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [
      totalBuses,
      activeBuses,
      totalDrivers,
      activeDrivers,
      totalRoutes,
      activeRoutes,
      activeContracts,
      pendingInvoices,
      vehiclesInService,
      totalVehicles
    ] = await Promise.all([
      Bus.count(),
      Bus.count({ where: { status: 'active' } }),
      Driver.count(),
      Driver.count({ where: { status: 'active' } }),
      Route.count(),
      Route.count({ where: { status: 'active' } }),
      Contract.count({ where: { status: 'active' } }),
      Invoice.count({ where: { status: 'pending' } }),
      Vehicle.count({ where: { status: 'under_service' } }),
      Vehicle.count()
    ]);

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const [
      expiringInsurances,
      expiringLicenses,
      lowStockParts
    ] = await Promise.all([
      Bus.count({
        where: {
          insurance_expiry: {
            [Op.between]: [today, thirtyDaysFromNow]
          },
          status: 'active'
        }
      }),
      Driver.count({
        where: {
          license_expiry: {
            [Op.between]: [today, thirtyDaysFromNow]
          },
          status: 'active'
        }
      }),
      SparePart.count({
        where: {
          quantity: {
            [Op.lte]: sequelize.col('min_quantity')
          }
        }
      })
    ]);

    const monthlyRevenue = await Payment.sum('amount', {
      where: {
        payment_date: {
          [Op.between]: [firstDayOfMonth, lastDayOfMonth]
        }
      }
    }) || 0;

    const monthlyExpenses = await Expense.sum('amount', {
      where: {
        expense_date: {
          [Op.between]: [firstDayOfMonth, lastDayOfMonth]
        },
        status: 'approved'
      }
    }) || 0;

    const monthlyIncomeResult = await Invoice.sum('total', {
      where: {
        issue_date: {
          [Op.between]: [firstDayOfMonth, lastDayOfMonth]
        },
        status: { [Op.in]: ['paid', 'partial'] }
      }
    });
    const monthlyIncome = monthlyIncomeResult || 0;

    const revenueVsExpenses = await getMonthlyRevenueExpenses();
    const monthlyPerformance = await getMonthlyPerformance();

    res.json({
      success: true,
      data: {
        overview: {
          totalBuses,
          activeBuses,
          totalDrivers,
          activeDrivers,
          totalRoutes,
          activeRoutes,
          activeContracts,
          pendingInvoices,
          vehiclesInService,
          totalVehicles
        },
        financials: {
          monthlyRevenue: parseFloat(monthlyRevenue),
          monthlyExpenses: parseFloat(monthlyExpenses),
          monthlyIncome: parseFloat(monthlyIncome),
          netProfit: parseFloat(monthlyRevenue) - parseFloat(monthlyExpenses)
        },
        alerts: {
          expiringInsurances,
          expiringLicenses,
          lowStockParts
        },
        charts: {
          revenueVsExpenses,
          monthlyPerformance
        }
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data'
    });
  }
};

async function getMonthlyRevenueExpenses() {
  const months = [];
  const currentDate = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
    
    const revenue = await Payment.sum('amount', {
      where: {
        payment_date: {
          [Op.between]: [monthDate, monthEnd]
        }
      }
    }) || 0;

    const expenses = await Expense.sum('amount', {
      where: {
        expense_date: {
          [Op.between]: [monthDate, monthEnd]
        },
        status: 'approved'
      }
    }) || 0;

    months.push({
      month: monthDate.toLocaleString('default', { month: 'short' }),
      revenue: parseFloat(revenue),
      expenses: parseFloat(expenses)
    });
  }
  
  return months;
}

async function getMonthlyPerformance() {
  const months = [];
  const currentDate = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);
    
    const trips = await Trip.count({
      where: {
        trip_date: {
          [Op.between]: [monthDate, monthEnd]
        },
        status: 'completed'
      }
    });

    const revenue = await Payment.sum('amount', {
      where: {
        payment_date: {
          [Op.between]: [monthDate, monthEnd]
        }
      }
    }) || 0;

    months.push({
      month: monthDate.toLocaleString('default', { month: 'short' }),
      trips,
      revenue: parseFloat(revenue)
    });
  }
  
  return months;
}

const getExpiringItems = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const [expiringInsurances, expiringLicenses] = await Promise.all([
      Bus.findAll({
        where: {
          insurance_expiry: {
            [Op.between]: [today, thirtyDaysFromNow]
          }
        },
        order: [['insurance_expiry', 'ASC']]
      }),
      Driver.findAll({
        where: {
          license_expiry: {
            [Op.between]: [today, thirtyDaysFromNow]
          }
        },
        order: [['license_expiry', 'ASC']]
      })
    ]);

    res.json({
      success: true,
      data: {
        expiringInsurances,
        expiringLicenses
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching expiring items'
    });
  }
};

module.exports = {
  getDashboardStats,
  getExpiringItems
};
