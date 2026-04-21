-- ================================
-- 1. Departments
-- ================================
CREATE TABLE IF NOT EXISTS departments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- ================================
-- 2. Students
-- ================================
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- ================================
-- 3. Instructors
-- ================================
CREATE TABLE IF NOT EXISTS instructors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    department_id INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE

    -- ON DELETE CASCADE:
    -- If a department is deleted → all its instructors are deleted

    -- ON UPDATE CASCADE:
    -- If department ID changes → instructor records update automatically
);


-- ================================
-- 4. Courses
-- ================================
CREATE TABLE IF NOT EXISTS courses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    syllabus TEXT,
    instructor_id INT,
    department_id INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (instructor_id)
    REFERENCES instructors(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    FOREIGN KEY (department_id)
    REFERENCES departments(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);


-- ================================
-- 5. Student_Courses (Junction Table)
-- ================================
-- Models many-to-many relationship:
-- One student ↔ many courses
-- One course ↔ many students

CREATE TABLE IF NOT EXISTS student_courses (
    student_id INT,
    course_id INT,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (student_id, course_id),

    FOREIGN KEY (student_id)
    REFERENCES students(id)
    ON DELETE CASCADE,

    FOREIGN KEY (course_id)
    REFERENCES courses(id)
    ON DELETE CASCADE
);


-- Add timestamps to junction table
ALTER TABLE student_courses
ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
ON UPDATE CURRENT_TIMESTAMP;


-- ================================
-- 6. Assignments
-- ================================
CREATE TABLE IF NOT EXISTS assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    title VARCHAR(255) NOT NULL,

    FOREIGN KEY (course_id)
    REFERENCES courses(id)
    ON DELETE CASCADE
);
