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

CREATE INDEX idx_leave_employee
ON leave_requests(employee_id);