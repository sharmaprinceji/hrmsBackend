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

 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 deleted_at TIMESTAMP NULL,

 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
 FOREIGN KEY(department_id) REFERENCES departments(id)
);

CREATE INDEX idx_employee_department
ON employees(department_id);

CREATE INDEX idx_employee_code
ON employees(employee_code);