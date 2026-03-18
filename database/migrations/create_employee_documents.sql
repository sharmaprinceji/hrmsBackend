CREATE TABLE employee_documents (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 employee_id BIGINT NOT NULL,
 document_type VARCHAR(100),
 file_url TEXT,

 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 deleted_at TIMESTAMP NULL,

 FOREIGN KEY(employee_id) REFERENCES employees(id)
);

CREATE INDEX idx_employee_docs_employee
ON employee_documents(employee_id);