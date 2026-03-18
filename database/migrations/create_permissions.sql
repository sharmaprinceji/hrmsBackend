CREATE TABLE permissions (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 module VARCHAR(100) NOT NULL,
 action VARCHAR(50) NOT NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_permission_module_action
ON permissions(module, action);