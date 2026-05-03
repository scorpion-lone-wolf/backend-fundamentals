const express = require("express");

const app = express();

app.get("/attack", (req, res) => {
  // I can send any script that can run who ever call this
  res.send(`
    <script>
      alert('You are running my script');
    </script>
  `);
});

app.listen(3000, () => {
  console.log("Accacker Server started");
});
