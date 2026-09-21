-- ==============================================================
-- DATABASE SCHEMA: QUẢN LÝ CĂN HỘ DỊCH VỤ (PostgreSQL / Vercel Postgres / Neon / Supabase)
-- ==============================================================

CREATE TABLE IF NOT EXISTS roles (
    role_id SERIAL PRIMARY KEY,
    role_key VARCHAR(50) UNIQUE NOT NULL,
    role_name VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    role_id INT NOT NULL REFERENCES roles(role_id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS buildings (
    building_id SERIAL PRIMARY KEY,
    building_name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    total_floors INT DEFAULT 1,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rooms (
    room_id SERIAL PRIMARY KEY,
    building_id INT NOT NULL REFERENCES buildings(building_id),
    room_number VARCHAR(20) NOT NULL,
    floor INT NOT NULL DEFAULT 1,
    room_type VARCHAR(50) DEFAULT 'Studio',
    area_sqm DECIMAL(6,2) DEFAULT 25.0,
    base_price DECIMAL(18,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'Trống',
    amenities TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tenants (
    tenant_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    full_name VARCHAR(100) NOT NULL,
    id_card VARCHAR(20) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    permanent_address VARCHAR(255),
    emergency_contact VARCHAR(150),
    vehicle_plate VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contracts (
    contract_id SERIAL PRIMARY KEY,
    contract_code VARCHAR(50) UNIQUE NOT NULL,
    room_id INT NOT NULL REFERENCES rooms(room_id),
    tenant_id INT NOT NULL REFERENCES tenants(tenant_id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent DECIMAL(18,2) NOT NULL,
    deposit_amount DECIMAL(18,2) NOT NULL,
    payment_cycle_months INT DEFAULT 1,
    status VARCHAR(30) DEFAULT 'Còn hiệu lực',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS utility_readings (
    reading_id SERIAL PRIMARY KEY,
    room_id INT NOT NULL REFERENCES rooms(room_id),
    reading_month INT NOT NULL,
    reading_year INT NOT NULL,
    prev_electric INT NOT NULL DEFAULT 0,
    curr_electric INT NOT NULL DEFAULT 0,
    electric_usage INT GENERATED ALWAYS AS (curr_electric - prev_electric) STORED,
    prev_water INT NOT NULL DEFAULT 0,
    curr_water INT NOT NULL DEFAULT 0,
    water_usage INT GENERATED ALWAYS AS (curr_water - prev_water) STORED,
    recorded_by VARCHAR(100),
    recorded_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_room_month_year UNIQUE (room_id, reading_month, reading_year)
);

CREATE TABLE IF NOT EXISTS invoices (
    invoice_id SERIAL PRIMARY KEY,
    invoice_code VARCHAR(50) UNIQUE NOT NULL,
    room_id INT NOT NULL REFERENCES rooms(room_id),
    tenant_id INT NOT NULL REFERENCES tenants(tenant_id),
    billing_month INT NOT NULL,
    billing_year INT NOT NULL,
    rent_fee DECIMAL(18,2) NOT NULL DEFAULT 0,
    electric_fee DECIMAL(18,2) NOT NULL DEFAULT 0,
    water_fee DECIMAL(18,2) NOT NULL DEFAULT 0,
    service_fee DECIMAL(18,2) NOT NULL DEFAULT 0,
    other_fee DECIMAL(18,2) NOT NULL DEFAULT 0,
    total_amount DECIMAL(18,2) NOT NULL DEFAULT 0,
    paid_amount DECIMAL(18,2) NOT NULL DEFAULT 0,
    due_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'Chưa thanh toán',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
    payment_id SERIAL PRIMARY KEY,
    payment_code VARCHAR(50) UNIQUE NOT NULL,
    invoice_id INT NOT NULL REFERENCES invoices(invoice_id),
    amount DECIMAL(18,2) NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Chuyển khoản VietQR',
    transaction_ref VARCHAR(100),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS departments (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS employees (
    employee_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    employee_code VARCHAR(30) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    department_id INT NOT NULL REFERENCES departments(department_id),
    position VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    id_card VARCHAR(20),
    hire_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'Đang làm việc',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS attendance (
    attendance_id SERIAL PRIMARY KEY,
    employee_id INT NOT NULL REFERENCES employees(employee_id),
    work_date DATE NOT NULL,
    shift VARCHAR(50) DEFAULT 'Ca hành chính (8h-17h)',
    check_in_time TIME,
    check_out_time TIME,
    status VARCHAR(30) DEFAULT 'Đúng giờ',
    notes VARCHAR(255),
    CONSTRAINT uq_emp_work_date UNIQUE (employee_id, work_date)
);

CREATE TABLE IF NOT EXISTS maintenance_requests (
    request_id SERIAL PRIMARY KEY,
    request_code VARCHAR(50) UNIQUE NOT NULL,
    room_id INT NOT NULL REFERENCES rooms(room_id),
    tenant_id INT NOT NULL REFERENCES tenants(tenant_id),
    category VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    priority VARCHAR(20) DEFAULT 'Bình thường',
    status VARCHAR(30) DEFAULT 'Chờ tiếp nhận',
    assigned_technician_id INT REFERENCES employees(employee_id),
    assigned_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS maintenance_logs (
    log_id SERIAL PRIMARY KEY,
    request_id INT NOT NULL REFERENCES maintenance_requests(request_id),
    technician_id INT NOT NULL REFERENCES employees(employee_id),
    action_taken TEXT NOT NULL,
    materials_used TEXT,
    repair_cost DECIMAL(18,2) DEFAULT 0,
    logged_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
