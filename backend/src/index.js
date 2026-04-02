const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const db = require('./config/database');
const sequelize = db;
const createDatabase = db.createDatabase;
const errorHandler = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const dashboardRoutes = require('./routes/dashboard');
const busRoutes = require('./routes/buses');
const driverRoutes = require('./routes/drivers');
const routeRoutes = require('./routes/routes');
const contractRoutes = require('./routes/contracts');
const invoiceRoutes = require('./routes/invoices');
const vehicleRoutes = require('./routes/vehicles');
const serviceRoutes = require('./routes/services');
const sparePartRoutes = require('./routes/spareParts');
const mechanicRoutes = require('./routes/mechanics');
const expenseRoutes = require('./routes/expenses');
const paymentRoutes = require('./routes/payments');
const reportRoutes = require('./routes/reports');
const tripReportRoutes = require('./routes/tripReports');
const mechanicServiceRoutes = require('./routes/mechanicServices');

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

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
}

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await createDatabase();
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    
    await sequelize.sync({ alter: false });
    console.log('Database models synchronized');
    
    const { seedDatabase } = require('./utils/seeder');
    await seedDatabase();
    
    app.listen(PORT, () => {
      console.log(`SmartFleet Pro API running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
