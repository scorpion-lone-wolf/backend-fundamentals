import express from "express";
import { verifyToken } from "./middleware/authMiddleware.js";

const PORT = 4002;
const app = express();

app.use(express.json());

app.get("/orders", verifyToken, (req, res) => {
  return res.json({
    success: true,
    message: "Order Fetched successfully",
    user: req.user,
    order: [
      {
        id: 1,
        item: "Laptop",
      },
      {
        id: 2,
        item: "Keyboard",
      },
    ],
  });
});

app.listen(PORT, () => {
  console.log("Order Service started at PORT", PORT);
});
