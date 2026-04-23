/* ============================================================
   edtech DATABASE - ASSIGNMENTS / REPORT QUERIES
   ------------------------------------------------------------
   Purpose:
   This file contains clean, structured, well-commented SQL
   queries for assignments, analytics, and reporting.

   Tables Used:
   - assignments
   - courses
   - instructors
   - students
   - student_courses

   Topics Covered:
   - SELECT
   - JOIN
   - LEFT JOIN
   - Aggregation
   - GROUP BY
   - ORDER BY
   - LIMIT

   ============================================================ */



/* ============================================================
   SECTION 1 : ASSIGNMENTS
   ============================================================ */


/* ------------------------------------------------------------
   1. List all assignments
   ------------------------------------------------------------
   Returns every assignment with basic details.
   ------------------------------------------------------------ */

SELECT
    id,
    title
FROM assignments;



/* ------------------------------------------------------------
   2. Get all assignments for a particular course
   ------------------------------------------------------------
   Returns assignments for course ID = 2

   Replace 2 with any course ID.
   ------------------------------------------------------------ */

SELECT
    a.id    AS assignment_id,
    a.title AS assignment_title,
    c.name  AS course_name
FROM assignments a
INNER JOIN courses c
    ON a.course_id = c.id
WHERE a.course_id = 2;



/* ------------------------------------------------------------
   3. Get assignment details with course & instructor info
   ------------------------------------------------------------
   Shows each assignment, course name, and instructor.
   ------------------------------------------------------------ */

SELECT
    a.id    AS assignment_id,
    a.title AS assignment_title,
    c.name  AS course_name,
    i.name  AS instructor_name
FROM assignments a
INNER JOIN courses c
    ON a.course_id = c.id
INNER JOIN instructors i
    ON c.instructor_id = i.id;



/* ============================================================
   SECTION 2 : ANALYTICS / REPORTING
   ============================================================ */


/* ------------------------------------------------------------
   4. Which instructor teaches the most courses?
   ------------------------------------------------------------
   Counts number of courses assigned to each instructor.

   Highest count shown first.
   LIMIT 1 returns top instructor only.
   ------------------------------------------------------------ */

SELECT
    i.id   AS instructor_id,
    i.name AS instructor_name,
    COUNT(c.id) AS course_count
FROM instructors i
INNER JOIN courses c
    ON i.id = c.instructor_id
GROUP BY i.id, i.name
ORDER BY course_count DESC
LIMIT 1;



/* ------------------------------------------------------------
   5. Which student is enrolled in the most courses?
   ------------------------------------------------------------
   Counts enrollments per student.

   Highest count shown first.
   LIMIT 1 returns top student only.
   ------------------------------------------------------------ */

SELECT
    s.id   AS student_id,
    s.name AS student_name,
    COUNT(sc.course_id) AS total_courses
FROM students s
INNER JOIN student_courses sc
    ON s.id = sc.student_id
GROUP BY s.id, s.name
ORDER BY total_courses DESC
LIMIT 1;



/* ------------------------------------------------------------
   6. Courses with no students enrolled
   ------------------------------------------------------------
   Uses LEFT JOIN + NULL filtering.

   Logic:
   - Return all courses
   - If no matching enrollment exists,
     student_courses columns become NULL
   ------------------------------------------------------------ */

SELECT
    c.id   AS course_id,
    c.name AS course_name
FROM courses c
LEFT JOIN student_courses sc
    ON c.id = sc.course_id
WHERE sc.course_id IS NULL;



/* ============================================================
   QUICK NOTES
   ------------------------------------------------------------
   COUNT(column):
   Counts non-null values only.

   GROUP BY:
   Creates groups before aggregation.

   ORDER BY DESC:
   Highest values first.

   LIMIT 1:
   Return top row only.

   LEFT JOIN + IS NULL:
   Finds missing relationships.
   ============================================================ */
