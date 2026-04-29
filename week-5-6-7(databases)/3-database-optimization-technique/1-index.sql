-- * Primary Index
CREATE Table users(
    id INT PRIMARY KEY,
    name VARCHAR(20) NOT NULL,
    email VARCHAR(30) NOT NULL UNIQUE,
    description TEXT
);
-- Here Primary key will create a Primary index by default
SELECT *
FROM users
WHERE id = 101; -- Now this query becomes fast
----------------------------------------------------------------------------------------------------------------------------
-- * Unique Index
-- Also UNIQUE constraint will by default create a Unique Index. Manually we can do using
CREATE UNQUE INDEX indx_email
ON users(email);

----------------------------------------------------------------------------------------------------------------------------

-- * Normal Index
CREATE INDEX indx_name
ON users(name);

----------------------------------------------------------------------------------------------------------------------------
-- * Composite Index
CREATE TABLE orders (
    id INT PRIMARY KEY,
    customer_id INT,
    status VARCHAR(50),
    amount DECIMAL(10,2)
);
-- This is used to create index combining more then 1 fiel. Example customer_id and status
CREATE INDEX indx_name
ON order(customer_id,status);

SELECT * FROM orders
where customer_id = 5
    AND status = 'Pending';

----------------------------------------------------------------------------------------------------------------------------
-- * Full Text Index
CREATE TABLE articles (
    id INT PRIMARY KEY,
    title VARCHAR(200),
    content TEXT
);

CREATE FULLTEXT INDEX
ON articles(content)

-- Fast text search in blogs/articles.
SELECT * FROM articles
WHERE MATCH(content)
    AGAINST('mysql indexing');


----------------------------------------------------------------------------------------------------------------------------
-- * Spatial Index
-- This is used in map/coordinated
CREATE TABLE stores (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    location POINT NOT NULL,
    -- SPATIAL INDEX(location)
);
CREATE SPATIAL INDEX
ON resturant(location);


INSERT INTO stores VALUES
(1, 'Store A', POINT(88.3639,22.5726)),
(2, 'Store B', POINT(88.4000,22.5800));

-- where all location from POINT(88.3639,22.5726) is less then 5km = 5 * 1000m = 5000m
SELECT name
FROM stores
WHERE ST_Distance_Sphere(
    location,
    POINT(88.3639,22.5726)
) < 5000;
