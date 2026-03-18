CREATE TABLE leave_balances (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 employee_id BIGINT NOT NULL,
 leave_type_id BIGINT NOT NULL,

 total_leaves INT DEFAULT 0,
 used_leaves INT DEFAULT 0,
 remaining_leaves INT DEFAULT 0,

 FOREIGN KEY(employee_id) REFERENCES employees(id),
 FOREIGN KEY(leave_type_id) REFERENCES leave_types(id),

 UNIQUE(employee_id, leave_type_id)
);

CREATE INDEX idx_leave_balance_employee
ON leave_balances(employee_id);