CREATE TABLE holidays (
 id BIGINT PRIMARY KEY AUTO_INCREMENT,
 name VARCHAR(150) NOT NULL,
 holiday_date DATE NOT NULL,

 type ENUM('national','regional','company') DEFAULT 'company',

 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_holiday_date
ON holidays(holiday_date);