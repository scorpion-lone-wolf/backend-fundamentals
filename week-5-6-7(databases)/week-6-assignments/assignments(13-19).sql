/* ============================================================
   edtech DATABASE - COMPLETE SQL REFERENCE FILE
   ------------------------------------------------------------
   Purpose:
   This file contains clean, structured, well-commented SQL
   queries for practicing and referencing:

   Tables:
   - departments
   - instructors
   - students
   - courses
   - student_courses (pivot table)

   Topics Covered:
   - SELECT
   - WHERE
   - JOIN
   - LEFT JOIN
   - Aggregation
   - GROUP BY
   - INSERT
   - DELETE

   ============================================================ */



/* ============================================================
   SECTION 1 : DEPARTMENTS
   ============================================================ */


/* List all departments */

SELECT
    id,
    name
FROM departments;


/* Get one department by ID */

SELECT *
FROM departments
WHERE id = 3;



/* ============================================================
   SECTION 2 : INSTRUCTORS
   ============================================================ */


/* List all instructors with department name */

SELECT
    i.id    AS instructor_id,
    i.name  AS instructor_name,
    i.email AS instructor_email,
    d.name  AS department_name
FROM instructors i
INNER JOIN departments d
    ON i.department_id = d.id;


/* Get one instructor by ID */

SELECT
    i.id,
    i.name,
    i.email,
    d.name AS department_name
FROM instructors i
INNER JOIN departments d
    ON i.department_id = d.id
WHERE i.id = 4;


/* List all instructors in a department */

SELECT
    i.id,
    i.name,
    i.email
FROM instructors i
WHERE i.department_id = 4;


/* Find which department an instructor belongs to */

SELECT
    d.id   AS department_id,
    d.name AS department_name
FROM departments d
INNER JOIN instructors i
    ON d.id = i.department_id
WHERE i.id = 3;



/* ============================================================
   SECTION 3 : COURSES
   ============================================================ */


/* List all courses with instructor name */

SELECT
    c.id   AS course_id,
    c.name AS course_name,
    i.name AS instructor_name
FROM courses c
INNER JOIN instructors i
    ON c.instructor_id = i.id;


/* Get one course by ID with department and instructor info */

SELECT
    c.id   AS course_id,
    c.name AS course_name,
    d.name AS department_name,
    i.name AS instructor_name
FROM courses c
INNER JOIN departments d
    ON c.department_id = d.id
INNER JOIN instructors i
    ON c.instructor_id = i.id
WHERE c.id = 5;


/* List all courses in a department */

SELECT
    c.id,
    c.name
FROM courses c
WHERE c.department_id = 4;


/* Get all courses taught by a specific instructor */

SELECT
    c.id,
    c.name,
    c.syllabus
FROM courses c
INNER JOIN instructors i
    ON c.instructor_id = i.id
WHERE i.id = 4;



/* ============================================================
   SECTION 4 : STUDENTS
   ============================================================ */


/* List all students */

SELECT *
FROM students;


/* Get one student by ID */

SELECT *
FROM students
WHERE id = 4;



/* ============================================================
   SECTION 5 : ENROLLMENTS (Pivot Table)
   ============================================================ */


/* List all enrollments (student-course pairs) */

SELECT
    s.id   AS student_id,
    s.name AS student_name,
    c.id   AS course_id,
    c.name AS course_name
FROM student_courses sc
INNER JOIN students s
    ON sc.student_id = s.id
INNER JOIN courses c
    ON sc.course_id = c.id;


/* List all students in a particular course */

SELECT
    s.id   AS student_id,
    s.name AS student_name
FROM student_courses sc
INNER JOIN students s
    ON sc.student_id = s.id
WHERE sc.course_id = 4;


/* Find all courses a student is enrolled in */

SELECT
    c.id   AS course_id,
    c.name AS course_name
FROM student_courses sc
INNER JOIN courses c
    ON sc.course_id = c.id
WHERE sc.student_id = 3;


/* List all students not enrolled in any courses */

SELECT
    s.id   AS student_id,
    s.name AS student_name
FROM students s
LEFT JOIN student_courses sc
    ON s.id = sc.student_id
WHERE sc.student_id IS NULL;



/* ============================================================
   SECTION 6 : AGGREGATION / GROUP BY
   ============================================================ */


/* Count how many courses each student is enrolled in */

SELECT
    s.id   AS student_id,
    s.name AS student_name,
    COUNT(sc.course_id) AS total_courses
FROM students s
LEFT JOIN student_courses sc
    ON s.id = sc.student_id
GROUP BY s.id, s.name;


/* Count how many students are enrolled in each course */

SELECT
    c.id   AS course_id,
    c.name AS course_name,
    COUNT(sc.student_id) AS total_students
FROM courses c
LEFT JOIN student_courses sc
    ON c.id = sc.course_id
GROUP BY c.id, c.name;



/* ============================================================
   SECTION 7 : INSERT / DELETE
   ============================================================ */


/* Enroll a student into a course */

INSERT INTO student_courses (
    student_id,
    course_id
)
VALUES (
    1,
    5
);


/* Unenroll a student from a course */

DELETE FROM student_courses
WHERE student_id = 1
AND course_id = 5;



/* ============================================================
   QUICK NOTES
   ------------------------------------------------------------
   INNER JOIN:
   Only matching rows from both tables.

   LEFT JOIN:
   All rows from left table +
   matching rows from right table.

   GROUP BY:
   Creates groups for aggregation.

   COUNT(column):
   Counts non-null values.

   student_courses:
   Junction table for many-to-many relation
   between students and courses.
   ============================================================ */
