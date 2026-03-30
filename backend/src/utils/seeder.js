const { sequelize, Role, User, Bus, Driver, Route, Contract, Vehicle, SparePart, ServiceRecord, Payment, Expense, TripReport, MechanicServiceRecord } = require('../models');
require('dotenv').config();

const seedRoles = async () => {
  const roles = [
    {
      name: 'admin',
      display_name: 'Admin',
      description: 'Full system access',
      permissions: {
        manage_all: true,
        view_all: true,
        edit_all: true,
        delete_all: true
      }
    },
    {
      name: 'driver',
      display_name: 'Driver',
      description: 'Driver access for trip reports',
      permissions: {
        create_trip_reports: true,
        view_own_trips: true,
        view_dashboard: true
      }
    },
    {
      name: 'mechanic',
      display_name: 'Mechanic',
      description: 'Mechanic access for service records',
      permissions: {
        create_service_records: true,
        view_own_services: true,
        view_dashboard: true
      }
    }
  ];

  for (const role of roles) {
    await Role.findOrCreate({
      where: { name: role.name },
      defaults: role
    });
  }
  console.log('Roles seeded successfully');
};

const seedAdminUser = async () => {
  const adminExists = await User.findOne({ where: { email: process.env.ADMIN_EMAIL } });
  
  if (!adminExists) {
    await User.create({
      name: 'System Administrator',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role_id: 1,
      status: 'active'
    });
    console.log('Admin user created');
  }
};

const seedSampleData = async () => {
  const busCount = await Bus.count();
  if (busCount > 0) {
    console.log('Sample data already exists');
    return;
  }

  const buses = [
    { plate_number: 'KBU-001A', model: 'Toyota Coaster', brand: 'Toyota', year: 2022, capacity: 30, status: 'active', fuel_type: 'diesel', insurance_expiry: '2026-12-31', mileage: 45000 },
    { plate_number: 'KBU-002B', model: 'Toyota Coaster', brand: 'Toyota', year: 2021, capacity: 30, status: 'active', fuel_type: 'diesel', insurance_expiry: '2026-06-15', mileage: 62000 },
    { plate_number: 'KBU-003C', model: 'Mitsubishi Rosa', brand: 'Mitsubishi', year: 2020, capacity: 25, status: 'active', fuel_type: 'diesel', insurance_expiry: '2026-04-20', mileage: 78000 },
    { plate_number: 'KBU-004D', model: 'Isuzu Bus', brand: 'Isuzu', year: 2023, capacity: 35, status: 'maintenance', fuel_type: 'diesel', insurance_expiry: '2026-08-10', mileage: 12000 },
    { plate_number: 'KBU-005E', model: 'Toyota Hiace', brand: 'Toyota', year: 2022, capacity: 15, status: 'active', fuel_type: 'petrol', insurance_expiry: '2026-11-25', mileage: 35000 }
  ];

  for (const bus of buses) {
    await Bus.create(bus);
  }

  const driverUser1 = await User.create({
    name: 'John Mwangi',
    email: 'driver@smartfleet.com',
    password: 'driver123',
    role_id: 2,
    phone: '+254712345678',
    status: 'active'
  });

  const driverUser2 = await User.create({
    name: 'Peter Kimani',
    email: 'peter@smartfleet.com',
    password: 'driver123',
    role_id: 2,
    phone: '+254723456789',
    status: 'active'
  });

  const drivers = [
    { name: 'John Mwangi', phone: '+254712345678', license_number: 'DL-001234', license_expiry: '2027-03-15', bus_id: 1, salary: 85000, hire_date: '2020-01-15', status: 'active', user_id: driverUser1.id },
    { name: 'Peter Kimani', phone: '+254723456789', license_number: 'DL-001235', license_expiry: '2026-05-20', bus_id: 2, salary: 85000, hire_date: '2019-06-01', status: 'active', user_id: driverUser2.id }
  ];

  for (const driver of drivers) {
    await Driver.create(driver);
  }

  const mechanicUser1 = await User.create({
    name: 'George Kamau',
    email: 'mechanic@smartfleet.com',
    password: 'mechanic123',
    role_id: 3,
    phone: '+254711234567',
    status: 'active'
  });

  const mechanicUser2 = await User.create({
    name: 'Michael Odhiambo',
    email: 'michael@smartfleet.com',
    password: 'mechanic123',
    role_id: 3,
    phone: '+254722345678',
    status: 'active'
  });

  const routes = [
    { name: 'Nairobi CBD - Industrial Area', origin: 'Nairobi CBD', destination: 'Industrial Area', shift: 'morning', departure_time: '06:00:00', driver_id: 1, bus_id: 1, worker_count: 28, status: 'active' },
    { name: 'Westlands - Industrial Area', origin: 'Westlands', destination: 'Industrial Area', shift: 'morning', departure_time: '06:15:00', driver_id: 2, bus_id: 2, worker_count: 25, status: 'active' }
  ];

  for (const route of routes) {
    await Route.create(route);
  }

  const contracts = [
    { contract_number: 'CTR-2024-001', client_name: 'Bloomfield Flowers Ltd', client_email: 'admin@bloomfield.com', service_type: 'transport', start_date: '2024-01-01', end_date: '2026-12-31', monthly_payment: 450000, status: 'active' },
    { contract_number: 'CTR-2024-002', client_name: 'Rose Valley Farms', client_email: 'ops@rosevalley.com', service_type: 'transport', start_date: '2024-03-01', end_date: '2026-02-28', monthly_payment: 320000, status: 'active' }
  ];

  for (const contract of contracts) {
    await Contract.create(contract);
  }

  const spareParts = [
    { part_number: 'SP-001', name: 'Engine Oil 10W-40', category: 'Oils & Fluids', quantity: 50, min_quantity: 10, unit: 'liter', cost_price: 450, selling_price: 650, status: 'active' },
    { part_number: 'SP-002', name: 'Brake Pads (Front)', category: 'Brakes', quantity: 8, min_quantity: 10, unit: 'set', cost_price: 2500, selling_price: 4000, status: 'active' },
    { part_number: 'SP-003', name: 'Air Filter', category: 'Filters', quantity: 25, min_quantity: 5, unit: 'piece', cost_price: 800, selling_price: 1200, status: 'active' },
    { part_number: 'SP-004', name: 'Fuel Filter', category: 'Filters', quantity: 20, min_quantity: 5, unit: 'piece', cost_price: 600, selling_price: 950, status: 'active' },
    { part_number: 'SP-005', name: 'Spark Plugs', category: 'Ignition', quantity: 3, min_quantity: 10, unit: 'piece', cost_price: 350, selling_price: 550, status: 'active' }
  ];

  for (const part of spareParts) {
    await SparePart.create(part);
  }

  const tripReports = [
    {
      driver_id: 1,
      bus_id: 1,
      farm_name: 'Bloomfield Flowers Ltd',
      trip_date: '2024-03-25',
      departure_time: '06:00:00',
      arrival_time: '08:00:00',
      bus_condition_before: 'Bus in good condition, all lights working',
      bus_condition_after: 'Bus returned in good condition',
      fuel_before: 80,
      fuel_after: 65,
      status: 'completed'
    },
    {
      driver_id: 1,
      bus_id: 1,
      farm_name: 'Rose Valley Farms',
      trip_date: '2024-03-26',
      departure_time: '06:30:00',
      arrival_time: '08:30:00',
      bus_condition_before: 'Bus in good condition',
      bus_condition_after: 'Bus returned safely',
      fuel_before: 75,
      fuel_after: 55,
      status: 'completed'
    }
  ];

  for (const report of tripReports) {
    await TripReport.create(report);
  }

  const mechanicRecords = [
    {
      mechanic_id: mechanicUser1.id,
      vehicle_type: 'Bus',
      number_plate: 'KBU-001A',
      problem_description: 'Engine oil change and filter replacement',
      spare_part_description: 'Engine Oil 10W-40, Oil Filter',
      spare_part_price: 950,
      service_date: '2024-03-20',
      status: 'completed'
    },
    {
      mechanic_id: mechanicUser2.id,
      vehicle_type: 'Car',
      number_plate: 'KBX-001A',
      problem_description: 'Brake pad replacement',
      spare_part_description: 'Front Brake Pads',
      spare_part_price: 4000,
      service_date: '2024-03-22',
      status: 'completed'
    }
  ];

  for (const record of mechanicRecords) {
    await MechanicServiceRecord.create(record);
  }

  const expenses = [
    { expense_number: 'EXP-001', category: 'fuel', description: 'Diesel - Week 1 March', amount: 45000, expense_date: '2024-03-01', payment_method: 'cash', status: 'approved' },
    { expense_number: 'EXP-002', category: 'salary', description: 'Driver Salaries - March 2024', amount: 170000, expense_date: '2024-03-01', payment_method: 'bank_transfer', status: 'approved' }
  ];

  for (const expense of expenses) {
    await Expense.create(expense);
  }

  console.log('Sample data seeded successfully');
};

const seedDatabase = async () => {
  try {
    await seedRoles();
    await seedAdminUser();
    await seedSampleData();
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = { seedDatabase };
