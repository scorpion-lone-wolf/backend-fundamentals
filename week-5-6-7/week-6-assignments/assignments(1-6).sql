/* ============================================================
   edtech DATABASE - REFERENCE QUERIES
   ------------------------------------------------------------
   Purpose:
   This file contains clean, well-commented SQL queries for
   common operations on:

   Tables:
   - departments
   - instructors
   - courses

   Use this file as a quick reference in your .sql project.
   ============================================================ */



/* ============================================================
   1. LIST ALL DEPARTMENTS
   ------------------------------------------------------------
   Returns every department with its basic details.
   ============================================================ */

SELECT
    id,
    name
FROM departments;



/* ============================================================
   2. GET ONE DEPARTMENT BY ID
   ------------------------------------------------------------
   Returns a specific department using primary key.

   Replace 3 with any department ID.
   ============================================================ */

SELECT
    *
FROM departments
WHERE id = 3;



/* ============================================================
   3. LIST ALL INSTRUCTORS IN A SPECIFIC DEPARTMENT
   ------------------------------------------------------------
   Returns instructors who belong to department ID = 4

   JOIN used:
   instructors.department_id = departments.id

   Replace 4 with desired department ID.
   ============================================================ */

SELECT
    i.id    AS instructor_id,
    i.name  AS instructor_name,
    i.email AS instructor_email,
    d.name  AS department_name
FROM instructors i
INNER JOIN departments d
    ON i.department_id = d.id
WHERE d.id = 4;



/* ============================================================
   4. LIST ALL COURSES OFFERED IN A SPECIFIC DEPARTMENT
   ------------------------------------------------------------
   Returns all courses under department ID = 4

   JOIN used:
   courses.department_id = departments.id

   Replace 4 with desired department ID.
   ============================================================ */

SELECT
    c.id   AS course_id,
    c.name AS course_name,
    d.name AS department_name
FROM courses c
INNER JOIN departments d
    ON c.department_id = d.id
WHERE d.id = 4;



/* ============================================================
   5. LIST ALL INSTRUCTORS
   ------------------------------------------------------------
   Returns every instructor along with their department name.
   ============================================================ */

SELECT
    i.id    AS instructor_id,
    i.name  AS instructor_name,
    i.email AS instructor_email,
    d.name  AS department_name
FROM instructors i
INNER JOIN departments d
    ON i.department_id = d.id;



/* ============================================================
   6. GET A SPECIFIC INSTRUCTOR BY ID
   ------------------------------------------------------------
   Returns one instructor with department details.

   Replace 4 with desired instructor ID.
   ============================================================ */

SELECT
    i.id    AS instructor_id,
    i.name  AS instructor_name,
    i.email AS instructor_email,
    d.name  AS department_name
FROM instructors i
INNER JOIN departments d
    ON i.department_id = d.id
WHERE i.id = 4;



/* ============================================================
   OPTIONAL QUICK NOTES
   ------------------------------------------------------------
   INNER JOIN:
   Returns matching records from both tables.

   WHERE:
   Filters rows.

   AS:
   Renames output columns.

   Example:
   i.name AS instructor_name
   ============================================================ */
