const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
//  Adding CSP = This tells my browser to not load any script or any thing from other source , only the source mention here
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    `
    default-src 'self';
    script-src 'self';
    img-src 'self';
    connect-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    `.replace(/\n/g, "")
  );
  next();
});

let comments = [];

// serve HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// API to get comments
app.get("/comments", (req, res) => {
  res.json(comments);
});

// add comment
app.post("/comment", (req, res) => {
  // Also use sanitize-html package
  comments.push(req.body.comment); // ❌ no sanitization
  res.redirect("/");
});

app.listen(4000, () => {
  console.log("Victim app running on http://localhost:4000");
});
