const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");

// create app object
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database(":memory:");
// inserting some data into db
db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER, username TEXT, password TEXT)");
  db.run("INSERT INTO users VALUES (1, 'admin', 'password123')");
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

// ❌ Un-Secure Login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // ❌ SQL Injection Vulnerability
  const query = `SELECT * FROM users WHERE username='${username}' AND password='${password}'`;
  //  In password if we give => ' OR '1'='1  then it will allow to login
  //  username: admin
  //  password: ' OR '1'='1
  //  username : ' OR '1'='1' --
  // password : empty

  db.get(query, (err, row) => {
    if (row) {
      res.send("Login Successful!");
    } else {
      res.send("Invalid credentials");
    }
  });
});

// ✅ Secure Login using parametrized query
app.post("/secure-login", (req, res) => {
  const { username, password } = req.body;
  const query = "SELECT * FROM users WHERE username=? AND password=?";
  db.get(query, [username, password], (err, row) => {
    if (row) {
      res.send("Secure Login Successful!");
    } else {
      res.send("Invalid credentials");
    }
  });
});

app.listen(3000, () => {
  console.log(`Server running at http://localhost:${3000}`);
});
