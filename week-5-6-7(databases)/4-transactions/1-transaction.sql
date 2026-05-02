-- =============================================
-- TABLE: users
-- Purpose: Store user information with account balance
-- =============================================

CREATE TABLE users (
    id         BIGINT AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    balance    BIGINT NOT NULL DEFAULT 0,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- COLUMN EXPLANATION
-- =============================================
-- id         : BIGINT      → Safe for very large scale (up to 9 quintillion)
-- name       : VARCHAR(100)→ NOT NULL to avoid anonymous users
-- balance    : BIGINT      → Use BIGINT to prevent integer overflow
--                          → NOT NULL + DEFAULT 0 prevents null-related bugs
-- created_at : Automatic timestamp for record creation
-- updated_at : Automatically updates on any change

-- =============================================
-- INSERT SAMPLE DATA
-- =============================================

INSERT INTO users (name, balance)
VALUES
    ('Rahul', 5000),
    ('Pursotam', 7000);

-- =============================================
-- VIEW DATA
-- =============================================

SELECT * FROM users;
-- SELECT id, name, balance FROM users;   -- Recommended for production

-- =============================================
-- TRANSACTION EXAMPLE: Money Transfer
-- Demonstrates ACID properties (Atomicity, Consistency, Isolation, Durability)
-- =============================================

BEGIN
-- Alisa for START TRANSACTION;

    -- Lock the rows we are going to modify to prevent race conditions
    SELECT balance
    FROM users
    WHERE id = 1
    FOR UPDATE;                    -- Important: Prevents dirty reads / lost updates

    -- Application logic should happen here (in your backend code):
    -- Example: Check if user has sufficient balance before proceeding
    -- IF (current_balance < 1000) THEN ROLLBACK;

    -- Deduct from sender
    UPDATE users
    SET balance = balance - 1000
    WHERE id = 1;

    -- Credit to receiver
    UPDATE users
    SET balance = balance + 1000
    WHERE id = 2;

-- If everything is successful, commit the transaction
COMMIT;

-- If any error occurs, you should ROLLBACK instead
-- ROLLBACK;

-- =============================================
-- VERIFY THE TRANSFER
-- =============================================

SELECT id, name, balance
FROM users
WHERE id IN (1, 2);
