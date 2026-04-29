-- *CREATE DATABASE
CREATE DATABASE IF NOT EXISTS mydb;

-- *USE DATABASE
USE mydb;

-- *CREATE TABLE
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- *view tables
SHOW TABLES;

-- *view table structure
DESCRIBE users;
""
-- *Insert data into table
INSERT INTO users (name, email) VALUES ("John Doe", "rahul@test.com");

-- *view data
SELECT * FROM users;

-- * view only name and email
SELECT name, email FROM users;

-- *condtionally view data
SELECT name, email FROM users WHERE name = "John Doe";

-- *view data which are partially matching
SELECT name, email FROM users WHERE name LIKE "%John%";

-- *update data
UPDATE users SET email = "rahul@test.com" WHERE name = "John Doe";


-- *delete data
DELETE FROM users WHERE name = "John Doe";

-- *add new field to table
ALTER TABLE users ADD COLUMN age INT;

-- *change name of field
ALTER TABLE users CHANGE COLUMN age user_age INT;
