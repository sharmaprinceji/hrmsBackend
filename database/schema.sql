SET FOREIGN_KEY_CHECKS = 0;

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

 FOREIGN KEY (manager_role_id) REFERENCES roles(id) ON DELETE CASCADE,
 FOREIGN KEY (target_role_id) REFERENCES roles(id) ON DELETE CASCADE,

 UNIQUE(manager_role_id,target_role_id)
);

-- =========================
-- PERMISSIONS
-- =========================
CREATE TABLE permissions (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 module VARCHAR(100) NOT NULL,
 action VARCHAR(50) NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_permission_module_action
ON permissions(module,action);

-- =========================
-- ROLE PERMISSIONS
-- =========================
CREATE TABLE role_permissions (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 role_id BIGINT,
 permission_id BIGINT,

 FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE,
 FOREIGN KEY(permission_id) REFERENCES permissions(id) ON DELETE CASCADE,

 UNIQUE(role_id,permission_id)
);

CREATE INDEX idx_role_permissions_role
ON role_permissions(role_id);

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
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 ON UPDATE CURRENT_TIMESTAMP,

 FOREIGN KEY(role_id) REFERENCES roles(id)
);

CREATE INDEX idx_users_email ON users(email);

-- =========================
-- REFRESH TOKENS
-- =========================
CREATE TABLE refresh_tokens (

 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 user_id BIGINT NOT NULL,
 token TEXT NOT NULL,
 expires_at DATETIME NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_refresh_user ON refresh_tokens(user_id);

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

 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY(department_id) REFERENCES departments(id)
);

CREATE INDEX idx_employee_department
ON employees(department_id);

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

 FOREIGN KEY(employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

CREATE INDEX idx_attendance_employee_date
ON attendance(employee_id,attendance_date);

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
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_holiday_date
ON holidays(holiday_date);

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

 FOREIGN KEY(assigned_by) REFERENCES users(id),
 FOREIGN KEY(assigned_to) REFERENCES users(id)
);

CREATE INDEX idx_tasks_assigned_to
ON tasks(assigned_to);

-- =========================
-- AUDIT LOGS
-- =========================
CREATE TABLE audit_logs (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 user_id BIGINT,
 action VARCHAR(50),

 entity_type VARCHAR(100),
 entity_id BIGINT,

 old_data JSON,
 new_data JSON,

 ip_address VARCHAR(50),
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type,entity_id);

SET FOREIGN_KEY_CHECKS = 1;