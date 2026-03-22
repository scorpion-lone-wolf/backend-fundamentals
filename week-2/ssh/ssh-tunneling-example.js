import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World from SSH Tunneling Example!2");
});

app.listen(3333, () => {
  console.log("Server is running on port 3000");
});
