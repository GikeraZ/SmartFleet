USE smartfleet_pro;

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS mechanic_service_records;
DROP TABLE IF EXISTS trip_reports;

-- Trip Reports Table (Driver specific)
CREATE TABLE trip_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    driver_id INT NOT NULL,
    bus_id INT,
    farm_name VARCHAR(200) NOT NULL,
    trip_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_time TIME,
    bus_condition_before TEXT,
    bus_condition_after TEXT,
    fuel_before DECIMAL(5,2),
    fuel_after DECIMAL(5,2),
    status ENUM('pending', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(id),
    FOREIGN KEY (bus_id) REFERENCES buses(id)
);

-- Mechanic Service Records Table (Mechanic specific)
CREATE TABLE mechanic_service_records (
    id INT AUTO_INCREMENT PRIMARY KEY,
    mechanic_id INT NOT NULL,
    vehicle_type ENUM('Bus', 'Car', 'Van', 'Truck', 'Other') NOT NULL,
    number_plate VARCHAR(20) NOT NULL,
    problem_description TEXT NOT NULL,
    spare_part_description TEXT,
    spare_part_price DECIMAL(10,2) DEFAULT 0,
    service_date DATE NOT NULL,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (mechanic_id) REFERENCES users(id)
);

-- Update roles with simplified permissions
UPDATE roles SET 
    display_name = 'Admin',
    permissions = '{"manage_all": true, "view_all": true, "edit_all": true, "delete_all": true}'
WHERE name = 'admin';

UPDATE roles SET 
    display_name = 'Driver',
    permissions = '{"create_trip_reports": true, "view_own_trips": true, "view_dashboard": true}'
WHERE name = 'driver';

UPDATE roles SET 
    display_name = 'Mechanic',
    permissions = '{"create_service_records": true, "view_own_services": true, "view_dashboard": true}'
WHERE name = 'mechanic';

-- Add drivers table foreign key to users
ALTER TABLE drivers ADD COLUMN user_id INT;

-- Create indexes
CREATE INDEX idx_trip_reports_driver ON trip_reports(driver_id);
CREATE INDEX idx_mechanic_records_mechanic ON mechanic_service_records(mechanic_id);
