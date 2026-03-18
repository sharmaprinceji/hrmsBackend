CREATE TABLE audit_logs (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,

 user_id BIGINT,
 action VARCHAR(50) NOT NULL,

 entity_type VARCHAR(100),
 entity_id BIGINT,

 old_data JSON,
 new_data JSON,

 ip_address VARCHAR(50),

 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

 FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_user
ON audit_logs(user_id);

CREATE INDEX idx_audit_entity
ON audit_logs(entity_type, entity_id);