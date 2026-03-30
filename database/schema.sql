-- SmartFleet Pro Database Schema
-- MySQL 8.0+

-- Create database
CREATE DATABASE IF NOT EXISTS smartfleet_pro CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE smartfleet_pro;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role_id INT NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    status ENUM('active', 'inactive') DEFAULT 'active',
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

-- Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    description TEXT,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Buses Table
CREATE TABLE IF NOT EXISTS buses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    plate_number VARCHAR(20) NOT NULL UNIQUE,
    model VARCHAR(100) NOT NULL,
    brand VARCHAR(50),
    year INT,
    capacity INT NOT NULL DEFAULT 50,
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    fuel_type ENUM('diesel', 'petrol', 'electric', 'hybrid') DEFAULT 'diesel',
    mileage DECIMAL(10,2) DEFAULT 0,
    insurance_expiry DATE,
    inspection_date DATE,
    next_service_date DATE,
    color VARCHAR(30),
    vin VARCHAR(50) UNIQUE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    address TEXT,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    license_expiry DATE NOT NULL,
    license_type VARCHAR(20) DEFAULT 'Class D',
    bus_id INT,
    salary DECIMAL(10,2) DEFAULT 0,
    hire_date DATE,
    date_of_birth DATE,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    status ENUM('active', 'inactive', 'on_leave') DEFAULT 'active',
    rating DECIMAL(3,2) DEFAULT 5.00,
    total_trips INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id)
);

-- Routes Table
CREATE TABLE IF NOT EXISTS routes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    pickup_points JSON,
    distance DECIMAL(10,2),
    estimated_duration INT,
    shift ENUM('morning', 'evening', 'night') DEFAULT 'morning',
    departure_time TIME,
    return_time TIME,
    driver_id INT,
    bus_id INT,
    worker_count INT DEFAULT 0,
    status ENUM('active', 'inactive') DEFAULT 'active',
    fare_per_trip DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (bus_id) REFERENCES buses(id)
);

-- Trips Table
CREATE TABLE IF NOT EXISTS trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    route_id INT NOT NULL,
    driver_id INT NOT NULL,
    bus_id INT NOT NULL,
    trip_date DATE NOT NULL,
    departure_time TIME,
    arrival_time TIME,
    passengers_count INT DEFAULT 0,
    fuel_consumed DECIMAL(8,2) DEFAULT 0,
    distance_covered DECIMAL(10,2) DEFAULT 0,
    status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (route_id) REFERENCES routes(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (bus_id) REFERENCES buses(id)
);

-- Contracts Table
CREATE TABLE IF NOT EXISTS contracts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    contract_number VARCHAR(50) NOT NULL UNIQUE,
    client_name VARCHAR(200) NOT NULL,
    client_email VARCHAR(100),
    client_phone VARCHAR(20),
    client_address TEXT,
    service_type ENUM('transport', 'garage', 'both') DEFAULT 'transport',
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_payment DECIMAL(10,2) NOT NULL,
    total_value DECIMAL(12,2),
    status ENUM('active', 'expired', 'terminated', 'pending') DEFAULT 'active',
    terms TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    contract_id INT,
    client_name VARCHAR(200) NOT NULL,
    client_address TEXT,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    items JSON,
    subtotal DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    total DECIMAL(10,2) DEFAULT 0,
    amount_paid DECIMAL(10,2) DEFAULT 0,
    status ENUM('pending', 'paid', 'partial', 'overdue', 'cancelled') DEFAULT 'pending',
    payment_date DATE,
    payment_method VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (contract_id) REFERENCES contracts(id)
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    payment_number VARCHAR(50) NOT NULL UNIQUE,
    invoice_id INT,
    contract_id INT,
    amount DECIMAL(10,2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method ENUM('cash', 'bank_transfer', 'check', 'card') DEFAULT 'cash',
    reference_number VARCHAR(100),
    payer_name VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id),
    FOREIGN KEY (contract_id) REFERENCES contracts(id)
);

-- Client Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    registration_number VARCHAR(50) NOT NULL UNIQUE,
    client_name VARCHAR(200) NOT NULL,
    client_phone VARCHAR(20),
    client_email VARCHAR(100),
    vehicle_type VARCHAR(50),
    make VARCHAR(50),
    model VARCHAR(50),
    year INT,
    vin VARCHAR(50),
    mileage DECIMAL(10,2) DEFAULT 0,
    fuel_type VARCHAR(20),
    color VARCHAR(30),
    status ENUM('active', 'under_service', 'completed', 'delivered') DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Service Records Table
CREATE TABLE IF NOT EXISTS service_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vehicle_id INT NOT NULL,
    service_number VARCHAR(50) NOT NULL UNIQUE,
    service_type VARCHAR(100) NOT NULL,
    description TEXT,
    mechanic_id INT,
    parts_used JSON,
    labor_hours DECIMAL(5,2) DEFAULT 0,
    labor_cost DECIMAL(10,2) DEFAULT 0,
    parts_cost DECIMAL(10,2) DEFAULT 0,
    total_cost DECIMAL(10,2) DEFAULT 0,
    service_date DATE NOT NULL,
    completion_date DATE,
    status ENUM('pending', 'in_progress', 'completed', 'delivered') DEFAULT 'pending',
    warranty VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id),
    FOREIGN KEY (mechanic_id) REFERENCES users(id)
);

-- Spare Parts Table
CREATE TABLE IF NOT EXISTS spare_parts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    part_number VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100),
    description TEXT,
    quantity INT DEFAULT 0,
    min_quantity INT DEFAULT 5,
    unit VARCHAR(20) DEFAULT 'piece',
    cost_price DECIMAL(10,2) DEFAULT 0,
    selling_price DECIMAL(10,2) DEFAULT 0,
    supplier_name VARCHAR(200),
    supplier_contact VARCHAR(100),
    location VARCHAR(100),
    status ENUM('active', 'discontinued', 'out_of_stock') DEFAULT 'active',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Part Usage Table
CREATE TABLE IF NOT EXISTS part_usage (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_record_id INT NOT NULL,
    spare_part_id INT NOT NULL,
    quantity_used INT NOT NULL,
    unit_price DECIMAL(10,2) DEFAULT 0,
    total_price DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (service_record_id) REFERENCES service_records(id),
    FOREIGN KEY (spare_part_id) REFERENCES spare_parts(id)
);

-- Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    expense_number VARCHAR(50) NOT NULL UNIQUE,
    category ENUM('fuel', 'salary', 'maintenance', 'repairs', 'insurance', 'supplies', 'utilities', 'other') DEFAULT 'other',
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    expense_date DATE NOT NULL,
    payment_method ENUM('cash', 'bank_transfer', 'check', 'card') DEFAULT 'cash',
    reference_number VARCHAR(100),
    bus_id INT,
    driver_id INT,
    receipt_path VARCHAR(255),
    status ENUM('pending', 'approved', 'rejected', 'paid') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bus_id) REFERENCES buses(id),
    FOREIGN KEY (driver_id) REFERENCES drivers(id)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_buses_status ON buses(status);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_spare_parts_quantity ON spare_parts(quantity);
