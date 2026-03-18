CREATE TABLE tasks (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 title VARCHAR(200) NOT NULL,
 description TEXT,

 assigned_by BIGINT,
 assigned_to BIGINT,

 priority ENUM('low','medium','high') DEFAULT 'medium',
 status ENUM('todo','in_progress','completed') DEFAULT 'todo',

 due_date DATE,

 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 deleted_at TIMESTAMP NULL,

 FOREIGN KEY(assigned_by) REFERENCES users(id),
 FOREIGN KEY(assigned_to) REFERENCES users(id)
);

CREATE INDEX idx_tasks_assigned_to
ON tasks(assigned_to);

CREATE INDEX idx_tasks_status
ON tasks(status);