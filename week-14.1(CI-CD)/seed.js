import "dotenv/config";
import pool from "./pool.js";

const DB_NAME = process.env.DB_NAME;

async function seed() {
  // Get a single, dedicated connection from the pool
  const connection = await pool.getConnection();
  try {
    // 1. Corrected Syntax: Added 'S' to EXISTS
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`);

    // 2. Switch context on this specific connection
    await connection.query(`USE ${DB_NAME}`);

    // 3. Corrected Syntax: Added 'S' to EXISTS
    await connection.query(`
      CREATE TABLE IF NOT EXISTS blogs(
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255),
        content TEXT
      );
    `);

    // 4. Insert data safely
    await connection.query(`
      INSERT INTO blogs (title, content)
      VALUES
        ('Docker Basics', 'Learning Docker is fun'),
        ('Volumes', 'Volumes provide persistent storage'),
        ('Networks', 'Containers communicate using networks')
    `);

    console.log("Database seed successful");
  } catch (error) {
    // This will now properly log the exact error to your Docker logs
    console.error("Seeding failed:", error);
  } finally {
    // Always release the connection back to the pool
    connection.release();
    // Optional: Close the pool entirely so the Node process exits cleanly
    await pool.end();
  }
}

seed();
