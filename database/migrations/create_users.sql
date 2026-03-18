CREATE TABLE users (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(150) NOT NULL,
 email VARCHAR(150) UNIQUE NOT NULL,
 password VARCHAR(255) NOT NULL,
 token_version INT DEFAULT 0,
 role_id BIGINT,
 status ENUM('active','inactive') DEFAULT 'active',

 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 deleted_at TIMESTAMP NULL,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 ON UPDATE CURRENT_TIMESTAMP,

 FOREIGN KEY(role_id) REFERENCES roles(id)
);

CREATE INDEX idx_users_role
ON users(role_id);

CREATE INDEX idx_users_email
ON users(email);