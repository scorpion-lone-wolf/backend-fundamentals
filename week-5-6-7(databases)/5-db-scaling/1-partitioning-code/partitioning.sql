-- =====================================================
-- DATABASE: Partitioning Demo
-- PURPOSE: Demonstrate MySQL Table Partitioning
-- TABLE: users with composite keys for partitioning support
-- =====================================================

-- =====================================================
-- STEP 1: CREATE TABLE WITH PROPER CONSTRAINTS
-- =====================================================
-- Note: For RANGE partitioning, ALL unique keys (including PRIMARY KEY)
-- must include the partitioning column (id) in their definition
-- =====================================================

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY ,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(30) NOT NULL ,
    UNIQUE KEY (id,email)
);

-- =====================================================
-- STEP 2: INSERT SAMPLE DATA
-- =====================================================
-- Inserting 10 users with various IDs (auto-generated from 1 to 10)
-- Note: id is AUTO_INCREMENT, so values will be assigned sequentially
-- =====================================================

INSERT INTO users (name, email) VALUES
('John Smith', 'john.smith@email.com'),           -- id = 1
('Emma Johnson', 'emma.johnson@email.com'),       -- id = 2
('Michael Brown', 'michael.brown@email.com'),     -- id = 3
('Sarah Wilson', 'sarah.wilson@email.com'),       -- id = 4
('David Lee', 'david.lee@email.com'),             -- id = 5
('Lisa Garcia', 'lisa.garcia@email.com'),         -- id = 6
('James Martinez', 'james.martinez@email.com'),   -- id = 7
('Maria Rodriguez', 'maria.rodriguez@email.com'), -- id = 8
('Robert Taylor', 'robert.taylor@email.com'),     -- id = 9
('Jennifer Anderson', 'jennifer.anderson@email.com'); -- id = 10


-- =====================================================
-- STEP 3: ADD RANGE PARTITIONING
-- =====================================================
-- Partitioning Methods:
--   1. RANGE: Partition by value ranges (uses VALUES LESS THAN)
--   2. LIST: Partition by discrete values (uses VALUES IN)
--   3. HASH: Automatically distribute rows across partitions
--
-- Current Implementation: RANGE partitioning on id column
-- =====================================================

ALTER TABLE users PARTITION BY RANGE(id)(
    PARTITION p0 VALUES LESS THAN (3),    -- Stores ids: 1, 2
    PARTITION p1 VALUES LESS THAN (6),    -- Stores ids: 3, 4, 5
    PARTITION p2 VALUES LESS THAN (9),    -- Stores ids: 6, 7, 8
    PARTITION pmax VALUES LESS THAN MAXVALUE -- Stores ids: 9, 10, and any future ids
);


-- =====================================================
-- STEP 4: VERIFY PARTITIONING
-- =====================================================

-- Method 1: View all partition details
SELECT
    TABLE_NAME,
    PARTITION_NAME,
    PARTITION_METHOD,
    PARTITION_EXPRESSION,
    TABLE_ROWS,
    ROUND(DATA_LENGTH / 1024 / 1024, 2) AS 'Size_MB',
    PARTITION_DESCRIPTION
FROM INFORMATION_SCHEMA.PARTITIONS
WHERE TABLE_NAME = 'users' AND PARTITION_NAME IS NOT NULL;

-- Method 2: View partition structure
SHOW CREATE TABLE users;


-- =====================================================
-- STEP 5: UNDERSTAND PARTITION PRUNING
-- =====================================================
-- Partition Pruning: MySQL automatically eliminates unnecessary partitions
-- based on the WHERE clause, improving query performance.
-- =====================================================

-- Query that checks only partition p2 (id=5 falls in 3-5 range)
EXPLAIN SELECT * FROM users WHERE id = 5;
-- Expected output: partitions column shows 'p1'

-- Query that checks all partitions (no partition key filter)
EXPLAIN SELECT * FROM users WHERE name = 'John Smith';
-- Expected output: partitions column shows 'p0,p1,p2,pmax'

-- Query that checks only partition pmax (id >= 9)
EXPLAIN SELECT * FROM users WHERE id >= 9;
