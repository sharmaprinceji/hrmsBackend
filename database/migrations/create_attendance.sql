CREATE TABLE attendance (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 employee_id BIGINT NOT NULL,
 attendance_date DATE NOT NULL,

 status ENUM('present','absent','half_day','wfh','holiday') DEFAULT 'present',

 check_in DATETIME,
 check_out DATETIME,

 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 FOREIGN KEY(employee_id) REFERENCES employees(id)
);

CREATE INDEX idx_attendance_employee_date
ON attendance(employee_id, attendance_date);