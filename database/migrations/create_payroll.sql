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

CREATE INDEX idx_payroll_employee
ON payroll(employee_id);