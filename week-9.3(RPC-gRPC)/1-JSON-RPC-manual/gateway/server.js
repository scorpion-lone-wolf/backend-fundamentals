import cors from "cors";
import express from "express";
import { callRPC } from "./rpcClient.js";

const app = express();

const PORT = 4000;
app.use(cors());

// Gateway endpoint that orchestrates calls to multiple services
app.get("/users/:id/details", async (req, res) => {
  const userId = +req.params.id; // Convert id to number

  // Gateway makes RPC calls to user service and order service,
  // combines results, and sends response to frontend
  try {
    // RPC call to user service
    const userPromise = callRPC({
      serviceURL: "http://localhost:4001/rpc",
      method: "getUser",
      params: {
        id: userId,
      },
    });

    console.log("calling Order service");

    // RPC call to order service with error handling for graceful degradation
    const ordersPromise = callRPC({
      serviceURL: "http://localhost:4002/rpc",
      method: "getUserByUserId",
      params: {
        userId: userId,
      },
    }).catch(error => {
      console.error("Order Service is unavailable");
      return []; // Return empty array on failure
    });

    // Execute both RPC calls in parallel using Promise.all
    const [user, orders] = await Promise.all([userPromise, ordersPromise]);

    // Combine results from both services
    const result = {
      user,
      orders,
    };
    return res.json(result);
  } catch (error) {
    console.log("error : ", error.message);
    return res.status(500).json({
      error: error.message,
    });
  }
});

// Start the gateway server
app.listen(PORT, () => {
  console.log(`Gateway Server started at http://localhost:${PORT}`);
});
