import express from "express";

const app = express();
const PORT = 4000;

app.use(express.json());
// client endpoint for login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // call auth-server for login
    const authLoginResponse = await fetch("http://localhost:4001/login", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await authLoginResponse.json();
    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});
// client endpoint to fetch orders
app.get("/orders", async (req, res) => {
  try {
    const ordersFetchResponse = await fetch("http://localhost:4002/orders", {
      method: "get",
      headers: req.headers,
    });
    const data = await ordersFetchResponse.json();
    return res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log("Gateway started at port 4000");
});
