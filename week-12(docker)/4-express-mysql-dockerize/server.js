import "dotenv/config";
import express from "express";
import pool from "./pool.js";

const app = express();

// handling route
app.get("/blog", async (req, res) => {
  try {
    await pool.query(`USE blog`);
    const [rows] = await pool.query("SELECT * FROM blogs");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});
app.listen(process.env.PORT || 3000, () => {
  console.log("My express started on port 3000");
});
