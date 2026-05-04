const express = require("express");
const cors = require("cors");
const orm = require("./orm");
const Database = require("better-sqlite3");

const app = express();
const port = 3001;

// creating a variable to store in memory object
const requestMap = new Map();
let id = 0;
app.use(cors());

// Open (or create) the SQLite database stored in demo.db
const db = new Database("./demo.db");
console.log("Connected to the SQLite database.");

// API endpoint that queries the database
app.get("/api/data", async (req, res) => {
  console.log("Received request. Querying database...");
  requestMap.set(id++, "ddd" + id);
  try {
    // blockForTwoSeconds(); // This Simulate the synchronous delay (i.e CPU heavy task)
    const data = await orm.getData(db);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

// Create table if it doesn't exist
db.exec(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY,
    message TEXT
  )`);

// Check if the table is empty, and insert sample data if so
const countRow = db.prepare("SELECT COUNT(*) AS count FROM messages").get();
if (countRow.count === 0) {
  db.prepare(`INSERT INTO messages (message) VALUES (?)`).run(
    "Data fetched from the database with delay."
  );
  console.log("Inserted initial data.");
}

function blockForTwoSeconds() {
  const start = Date.now();
  while (Date.now() - start < 2000) {
    // Busy-wait loop: do nothing until 2 seconds have passed
  }
  console.log("2 seconds have passed");
}
