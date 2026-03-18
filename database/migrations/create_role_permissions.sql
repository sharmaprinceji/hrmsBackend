CREATE TABLE role_permissions (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 role_id BIGINT NOT NULL,
 permission_id BIGINT NOT NULL,

 UNIQUE(role_id, permission_id),

 FOREIGN KEY(role_id) REFERENCES roles(id) ON DELETE CASCADE,
 FOREIGN KEY(permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

CREATE INDEX idx_role_permissions_role
ON role_permissions(role_id);