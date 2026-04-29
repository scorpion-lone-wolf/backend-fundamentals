-- In this file we will practice SQL joins using the tables we created in the previous exercises- (week-5-6-7/1-mysql-docker/realtionship.sql).:

/******************************************************************************************
 MYSQL JOINS + BASIC QUERY NOTES
 -----------------------------------------------------------------------------------------
 Purpose:
 Save this file as a quick revision guide for SQL basics and JOIN operations.

 Tables Used:
 1. courses
 2. departments
 3. instructors

 Assumed Relationships:
 -----------------------------------------------------------------------------------------
 courses.instructor_id      -> instructors.id
 instructors.department_id  -> departments.id

 JOIN Summary:
 -----------------------------------------------------------------------------------------
 INNER JOIN  = Only matching rows from both tables
 LEFT JOIN   = All rows from left table + matched rows from right table
 RIGHT JOIN  = All rows from right table + matched rows from left table
 FULL JOIN   = All rows from both tables (MySQL workaround using UNION)
 CROSS JOIN  = Every row with every row (Cartesian product)

******************************************************************************************/



/******************************************************************************************
 SECTION 1: BASIC SELECT QUERIES
******************************************************************************************/

-- *Get all courses
-- *Returns course id, name, and syllabus
SELECT
    id,
    name,
    syllabus
FROM courses;



-- *Get all departments
-- *Returns every department
SELECT
    id,
    name
FROM departments;



-- *Get a specific department where id = 3
-- *Useful for filtering a single row
SELECT
    id,
    name
FROM departments
WHERE id = 3;



/******************************************************************************************
 SECTION 2: INNER JOIN
******************************************************************************************/

-- *Get all courses with their instructor details
-- *Only returns rows where instructor exists
-- *If a course has no valid instructor_id, it will NOT appear

SELECT
    c.id        AS course_id,
    c.name      AS course_name,
    c.syllabus  AS course_syllabus,

    i.id        AS instructor_id,
    i.name      AS instructor_name

FROM courses c
INNER JOIN instructors i
    ON c.instructor_id = i.id;



/******************************************************************************************
 SECTION 3: LEFT JOIN
******************************************************************************************/

-- *Get all departments with their instructors
-- *Returns ALL departments
-- *If no instructor exists in a department, instructor_name = NULL

SELECT
    d.id     AS dept_id,
    d.name   AS dept_name,
    i.name   AS instructor_name

FROM departments d
LEFT JOIN instructors i
    ON d.id = i.department_id;



/******************************************************************************************
 SECTION 4: RIGHT JOIN
******************************************************************************************/

-- *Get all departments with their instructors
-- *Returns ALL departments because departments table is on RIGHT side
-- *Similar result to LEFT JOIN above

SELECT
    d.id     AS dept_id,
    d.name   AS dept_name,
    i.name   AS instructor_name

FROM instructors i
RIGHT JOIN departments d
    ON d.id = i.department_id;



/******************************************************************************************
 SECTION 5: FULL OUTER JOIN (MySQL Workaround)
******************************************************************************************/

-- *MySQL does NOT support FULL OUTER JOIN directly
-- *So combine:
-- *LEFT JOIN  -> all departments
-- *RIGHT JOIN -> all instructors
-- *UNION removes duplicates

SELECT
    d.id,
    d.name,
    i.name

FROM departments d
LEFT JOIN instructors i
    ON d.id = i.department_id

UNION

SELECT
    d.id,
    d.name,
    i.name

FROM departments d
RIGHT JOIN instructors i
    ON d.id = i.department_id;



/******************************************************************************************
 SECTION 6: CROSS JOIN
******************************************************************************************/

-- *Returns every department paired with every instructor
-- *If departments = 3 rows
-- *If instructors = 5 rows
-- *Result = 15 rows

SELECT
    d.name AS department,
    i.name AS instructor

FROM departments d
CROSS JOIN instructors i;



/******************************************************************************************
 QUICK MEMORY TRICK
 -----------------------------------------------------------------------------------------
 INNER JOIN  -> Match only
 LEFT JOIN   -> Keep left table always
 RIGHT JOIN  -> Keep right table always
 FULL JOIN   -> Keep everything
 CROSS JOIN  -> Multiply rows
******************************************************************************************/
