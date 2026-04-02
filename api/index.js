const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const db = require('./src/config/database');
const sequelize = db;
const createDatabase = db.createDatabase;
const errorHandler = require('./src/middleware/errorHandler');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/users');
const dashboardRoutes = require('./src/routes/dashboard');
const busRoutes = require('./src/routes/buses');
const driverRoutes = require('./src/routes/drivers');
const routeRoutes = require('./src/routes/routes');
const contractRoutes = require('./src/routes/contracts');
const invoiceRoutes = require('./src/routes/invoices');
const vehicleRoutes = require('./src/routes/vehicles');
const serviceRoutes = require('./src/routes/services');
const sparePartRoutes = require('./src/routes/spareParts');
const mechanicRoutes = require('./src/routes/mechanics');
const expenseRoutes = require('./src/routes/expenses');
const paymentRoutes = require('./src/routes/payments');
const reportRoutes = require('./src/routes/reports');
const tripReportRoutes = require('./src/routes/tripReports');
const mechanicServiceRoutes = require('./src/routes/mechanicServices');

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/spare-parts', sparePartRoutes);
app.use('/api/mechanics', mechanicRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/trips', tripReportRoutes);
app.use('/api/mechanic-services', mechanicServiceRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SmartFleet Pro API is running' });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await createDatabase();
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    await sequelize.sync({ alter: false });
    console.log('Database models synchronized');
    
    const { seedDatabase } = require('./src/utils/seeder');
    await seedDatabase();
  } catch (error) {
    console.error('Unable to start server:', error);
  }
};

let isInitialized = false;

const init = async () => {
  if (!isInitialized) {
    await startServer();
    isInitialized = true;
  }
};

init();

module.exports = app;