const sequelize = require('../config/database');
const User = require('./User');
const Role = require('./Role');
const Bus = require('./Bus');
const Driver = require('./Driver');
const Route = require('./Route');
const Trip = require('./Trip');
const Contract = require('./Contract');
const Invoice = require('./Invoice');
const Vehicle = require('./Vehicle');
const ServiceRecord = require('./ServiceRecord');
const SparePart = require('./SparePart');
const PartUsage = require('./PartUsage');
const Expense = require('./Expense');
const Payment = require('./Payment');
const TripReport = require('./TripReport');
const MechanicServiceRecord = require('./MechanicServiceRecord');

Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

Bus.hasMany(Driver, { foreignKey: 'bus_id', as: 'drivers' });
Driver.belongsTo(Bus, { foreignKey: 'bus_id', as: 'bus' });

Route.hasMany(Driver, { foreignKey: 'driver_id', as: 'assignedDrivers' });
Driver.belongsTo(Route, { foreignKey: 'driver_id', as: 'assignedRoute' });

Bus.hasMany(Route, { foreignKey: 'bus_id', as: 'routes' });
Route.belongsTo(Bus, { foreignKey: 'bus_id', as: 'bus' });

Driver.hasMany(Route, { foreignKey: 'driver_id', as: 'routes' });
Route.belongsTo(Driver, { foreignKey: 'driver_id', as: 'driver' });

Route.hasMany(Trip, { foreignKey: 'route_id', as: 'trips' });
Trip.belongsTo(Route, { foreignKey: 'route_id', as: 'route' });

Driver.hasMany(Trip, { foreignKey: 'driver_id', as: 'trips' });
Trip.belongsTo(Driver, { foreignKey: 'driver_id', as: 'driver' });

Bus.hasMany(Trip, { foreignKey: 'bus_id', as: 'trips' });
Trip.belongsTo(Bus, { foreignKey: 'bus_id', as: 'bus' });

Contract.hasMany(Invoice, { foreignKey: 'contract_id', as: 'invoices' });
Invoice.belongsTo(Contract, { foreignKey: 'contract_id', as: 'contract' });

Invoice.hasMany(Payment, { foreignKey: 'invoice_id', as: 'payments' });
Payment.belongsTo(Invoice, { foreignKey: 'invoice_id', as: 'invoice' });

Contract.hasMany(Payment, { foreignKey: 'contract_id', as: 'payments' });
Payment.belongsTo(Contract, { foreignKey: 'contract_id', as: 'contract' });

Vehicle.hasMany(ServiceRecord, { foreignKey: 'vehicle_id', as: 'serviceRecords' });
ServiceRecord.belongsTo(Vehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });

User.hasMany(ServiceRecord, { foreignKey: 'mechanic_id', as: 'assignedServices' });
ServiceRecord.belongsTo(User, { foreignKey: 'mechanic_id', as: 'mechanic' });

ServiceRecord.hasMany(PartUsage, { foreignKey: 'service_record_id', as: 'partUsages' });
PartUsage.belongsTo(ServiceRecord, { foreignKey: 'service_record_id', as: 'serviceRecord' });

SparePart.hasMany(PartUsage, { foreignKey: 'spare_part_id', as: 'partUsages' });
PartUsage.belongsTo(SparePart, { foreignKey: 'spare_part_id', as: 'sparePart' });

Bus.hasMany(Expense, { foreignKey: 'bus_id', as: 'expenses' });
Expense.belongsTo(Bus, { foreignKey: 'bus_id', as: 'bus' });

Driver.hasMany(Expense, { foreignKey: 'driver_id', as: 'expenses' });
Expense.belongsTo(Driver, { foreignKey: 'driver_id', as: 'driver' });

Driver.hasMany(TripReport, { foreignKey: 'driver_id', as: 'tripReports' });
TripReport.belongsTo(Driver, { foreignKey: 'driver_id', as: 'driver' });

Bus.hasMany(TripReport, { foreignKey: 'bus_id', as: 'tripReports' });
TripReport.belongsTo(Bus, { foreignKey: 'bus_id', as: 'bus' });

User.hasMany(MechanicServiceRecord, { foreignKey: 'mechanic_id', as: 'mechanicRecords' });
MechanicServiceRecord.belongsTo(User, { foreignKey: 'mechanic_id', as: 'mechanic' });

module.exports = {
  sequelize,
  User,
  Role,
  Bus,
  Driver,
  Route,
  Trip,
  Contract,
  Invoice,
  Vehicle,
  ServiceRecord,
  SparePart,
  PartUsage,
  Expense,
  Payment,
  TripReport,
  MechanicServiceRecord
};
