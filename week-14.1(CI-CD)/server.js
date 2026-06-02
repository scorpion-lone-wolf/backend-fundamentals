import "dotenv/config";
import express from "express";
import pool from "./pool.js";
import { getHostName, getVersion } from "./utils/index.js";

const app = express();
// const a = 1;
// handling route
app.get("/blog", async (req, res) => {
  try {
    await pool.query(`USE blog`);
    const [rows] = await pool.query("SELECT * FROM blogs");
    res.json({
      data: rows,
      status: "success",
      message: "blog fetched msg",
      version: getVersion(),
      host: process.env.RUNNING_ON_HOST || getHostName(),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error.message,
    });
  }
});

// for health ping
app.get("/health", (req, res) => {
  return res.json({
    status: "ok",
  });
});
app.listen(process.env.PORT || 3000, () => {
  console.log("My express started on port 3000");
});
