INSERT INTO permissions(module,action) VALUES

-- Employee
('employee','create'),
('employee','update'),
('employee','delete'),
('employee','view'),

-- Department
('department','create'),
('department','update'),
('department','delete'),
('department','view'),

-- Leave
('leave','apply'),
('leave','approve'),
('leave','view'),

-- Attendance
('attendance','mark'),
('attendance','view'),
('attendance','report'),

-- Payroll
('payroll','generate'),
('payroll','view'),

-- Task
('task','create'),
('task','update'),
('task','delete'),
('task','view'),

-- Holiday
('holiday','create'),
('holiday','update'),
('holiday','delete'),
('holiday','view');