/* ============================================================
   edtech DATABASE - STUDENTS / INSTRUCTORS / COURSES
   ------------------------------------------------------------
   Purpose:
   This section contains well-structured SQL reference queries
   related to:

   - instructors
   - departments
   - students
   - courses
   - enrollments (student_courses)

   Use this file as reusable SQL notes.
   ============================================================ */



/* ============================================================
   1. GET ALL COURSES TAUGHT BY A SPECIFIC INSTRUCTOR
   ------------------------------------------------------------
   Returns all courses assigned to instructor ID = 4

   Replace 4 with any instructor ID.
   ============================================================ */

SELECT
    c.id        AS course_id,
    c.name      AS course_name,
    c.syllabus  AS course_syllabus
FROM courses c
INNER JOIN instructors i
    ON c.instructor_id = i.id
WHERE i.id = 4;



/* ============================================================
   2. FIND WHICH DEPARTMENT AN INSTRUCTOR BELONGS TO
   ------------------------------------------------------------
   Returns department details for instructor ID = 3

   Replace 3 with any instructor ID.
   ============================================================ */

SELECT
    d.id   AS department_id,
    d.name AS department_name
FROM departments d
INNER JOIN instructors i
    ON d.id = i.department_id
WHERE i.id = 3;



/* ============================================================
   3. LIST ALL STUDENTS
   ------------------------------------------------------------
   Returns every student from students table.
   ============================================================ */

SELECT *
FROM students;



/* ============================================================
   4. GET A STUDENT BY ID
   ------------------------------------------------------------
   Returns one student record using primary key.

   Replace 4 with any student ID.
   ============================================================ */

SELECT *
FROM students
WHERE id = 4;



/* ============================================================
   5. FIND ALL COURSES A STUDENT IS ENROLLED IN
   ------------------------------------------------------------
   Returns all courses taken by student ID = 3

   Many-to-Many Relationship:
   students <-> student_courses <-> courses

   Replace 3 with any student ID.
   ============================================================ */

SELECT
    c.id   AS course_id,
    c.name AS course_name
FROM courses c
INNER JOIN student_courses sc
    ON c.id = sc.course_id
WHERE sc.student_id = 3;



/* ============================================================
   6. LIST ALL STUDENTS NOT ENROLLED IN ANY COURSES
   ------------------------------------------------------------
   Uses LEFT JOIN + NULL filtering

   Logic:
   - Return all students
   - If no matching enrollment exists,
     student_courses columns become NULL
   - Filter those NULL rows only
   ============================================================ */

SELECT
    s.id   AS student_id,
    s.name AS student_name
FROM students s
LEFT JOIN student_courses sc
    ON s.id = sc.student_id
WHERE sc.student_id IS NULL;



/* ============================================================
   QUICK NOTES
   ------------------------------------------------------------
   INNER JOIN:
   Returns matching rows only.

   LEFT JOIN:
   Returns all rows from left table +
   matching rows from right table.

   IS NULL:
   Used to check missing values.

   student_courses:
   Junction table used for many-to-many relation
   between students and courses.
   ============================================================ */
