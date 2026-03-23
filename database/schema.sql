SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS holidays;
DROP TABLE IF EXISTS payroll;
DROP TABLE IF EXISTS leave_requests;
DROP TABLE IF EXISTS leave_balances;
DROP TABLE IF EXISTS leave_types;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS employee_documents;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS refresh_tokens;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS role_permissions;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS role_manage_rules;
DROP TABLE IF EXISTS roles;

-- =========================
-- ROLES
-- =========================
CREATE TABLE roles (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(100) UNIQUE NOT NULL,
 description TEXT,
 deleted_at TIMESTAMP NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- ROLE MANAGE RULES
-- =========================
CREATE TABLE role_manage_rules (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 manager_role_id BIGINT NOT NULL,
 target_role_id BIGINT NOT NULL,

 UNIQUE(manager_role_id,target_role_id),

 FOREIGN KEY (manager_role_id) REFERENCES roles(id) ON DELETE CASCADE,
 FOREIGN KEY (target_role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- =========================
-- PERMISSIONS
-- =========================
CREATE TABLE permissions (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 module VARCHAR(100) NOT NULL,
 action VARCHAR(50) NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 INDEX idx_permission_module_action (module, action)
);

-- =========================
-- ROLE PERMISSIONS
-- =========================
CREATE TABLE role_permissions (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 role_id BIGINT,
 permission_id BIGINT,

 UNIQUE(role_id,permission_id),
 INDEX idx_role_permissions_role (role_id),

 FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE,
 FOREIGN KEY(permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(150) NOT NULL,
 email VARCHAR(150) UNIQUE NOT NULL,
 password VARCHAR(255) NOT NULL,
 token_version INT DEFAULT 0,
 role_id BIGINT,
 status ENUM('active','inactive') DEFAULT 'active',

 deleted_at TIMESTAMP NULL,

 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP NULL,

 INDEX idx_users_email (email),

 FOREIGN KEY(role_id) REFERENCES roles(id)
);

-- =========================
-- REFRESH TOKENS
-- =========================
CREATE TABLE refresh_tokens (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 user_id BIGINT NOT NULL,
 token TEXT NOT NULL,
 expires_at DATETIME NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 INDEX idx_refresh_user (user_id),

 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =========================
-- DEPARTMENTS
-- =========================
CREATE TABLE departments (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(150) NOT NULL,
 description TEXT,
 manager_id BIGINT,

 deleted_at TIMESTAMP NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 FOREIGN KEY(manager_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =========================
-- EMPLOYEES
-- =========================
CREATE TABLE employees (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 user_id BIGINT UNIQUE NOT NULL,
 employee_code VARCHAR(50) UNIQUE NOT NULL,

 department_id BIGINT,
 designation VARCHAR(150),

 phone VARCHAR(20),
 address TEXT,
 dob DATE,
 joining_date DATE,
 salary DECIMAL(12,2),

 deleted_at TIMESTAMP NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 INDEX idx_employee_department (department_id),

 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY(department_id) REFERENCES departments(id)
);

-- =========================
-- EMPLOYEE DOCUMENTS
-- =========================
CREATE TABLE employee_documents (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 employee_id BIGINT NOT NULL,
 document_type VARCHAR(100),
 file_url TEXT,

 deleted_at TIMESTAMP NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 FOREIGN KEY(employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- =========================
-- ATTENDANCE
-- =========================
CREATE TABLE attendance (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 employee_id BIGINT NOT NULL,
 attendance_date DATE NOT NULL,

 status ENUM('present','absent','half_day','wfh','holiday'),

 check_in DATETIME,
 check_out DATETIME,

 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 INDEX idx_attendance_employee_date (employee_id, attendance_date),

 FOREIGN KEY(employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- =========================
-- LEAVE TYPES
-- =========================
CREATE TABLE leave_types (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(100),
 max_days INT DEFAULT 0,

 deleted_at TIMESTAMP NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- LEAVE BALANCES
-- =========================
CREATE TABLE leave_balances (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 employee_id BIGINT NOT NULL,
 leave_type_id BIGINT NOT NULL,

 total_leaves INT DEFAULT 0,
 used_leaves INT DEFAULT 0,
 remaining_leaves INT DEFAULT 0,

 UNIQUE(employee_id,leave_type_id),

 FOREIGN KEY(employee_id) REFERENCES employees(id) ON DELETE CASCADE,
 FOREIGN KEY(leave_type_id) REFERENCES leave_types(id)
);

-- =========================
-- LEAVE REQUESTS
-- =========================
CREATE TABLE leave_requests (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 employee_id BIGINT NOT NULL,
 leave_type_id BIGINT NOT NULL,

 start_date DATE,
 end_date DATE,
 days INT,
 reason TEXT,

 status ENUM('pending','approved','rejected') DEFAULT 'pending',
 approved_by BIGINT,

 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 FOREIGN KEY(employee_id) REFERENCES employees(id),
 FOREIGN KEY(leave_type_id) REFERENCES leave_types(id),
 FOREIGN KEY(approved_by) REFERENCES users(id)
);

-- =========================
-- PAYROLL
-- =========================
CREATE TABLE payroll (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 employee_id BIGINT NOT NULL,

 payroll_month INT,
 payroll_year INT,

 basic_salary DECIMAL(12,2),
 hra DECIMAL(12,2),
 allowances DECIMAL(12,2),

 pf DECIMAL(12,2),
 esi DECIMAL(12,2),
 tds DECIMAL(12,2),

 gross_salary DECIMAL(12,2),
 deductions DECIMAL(12,2),
 net_salary DECIMAL(12,2),

 generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 FOREIGN KEY(employee_id) REFERENCES employees(id)
);

-- =========================
-- HOLIDAYS
-- =========================
CREATE TABLE holidays (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(150) NOT NULL,
 holiday_date DATE NOT NULL,

 type ENUM('national','regional','company') DEFAULT 'company',

 deleted_at TIMESTAMP NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 INDEX idx_holiday_date (holiday_date)
);

-- =========================
-- TASKS
-- =========================
CREATE TABLE tasks (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 title VARCHAR(200) NOT NULL,
 description TEXT,

 assigned_by BIGINT,
 assigned_to BIGINT,

 priority ENUM('low','medium','high') DEFAULT 'medium',
 status ENUM('todo','in_progress','completed') DEFAULT 'todo',

 due_date DATE,

 deleted_at TIMESTAMP NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 INDEX idx_tasks_assigned_to (assigned_to),

 FOREIGN KEY(assigned_by) REFERENCES users(id),
 FOREIGN KEY(assigned_to) REFERENCES users(id)
);

-- =========================
-- AUDIT LOGS
-- =========================
CREATE TABLE audit_logs (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 user_id BIGINT,
 action VARCHAR(50),

 entity_type VARCHAR(100),
 entity_id BIGINT,

 old_data TEXT,
 new_data TEXT,

 ip_address VARCHAR(50),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 INDEX idx_audit_user (user_id),
 INDEX idx_audit_entity (entity_type, entity_id),

 FOREIGN KEY(user_id) REFERENCES users(id)
);

SET FOREIGN_KEY_CHECKS = 1;