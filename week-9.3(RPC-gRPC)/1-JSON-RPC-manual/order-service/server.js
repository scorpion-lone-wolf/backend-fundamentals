import cors from "cors";
import express from "express";

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 4002;

// Fake database for orders
const orders = [
  {
    id: 1,
    userId: 1,
    item: "Laptop",
  },
  {
    id: 2,
    userId: 1,
    item: "Keyboard",
  },
  {
    id: 3,
    userId: 2,
    item: "Mouse",
  },
];

// Define RPC methods for order operations
const rpcMethods = {
  getUserByUserId: async ({ userId }) => {
    // Simulate a delay to demonstrate slow service (5 seconds)
    await new Promise(resolve => setTimeout(resolve, 5000));
    return orders.filter(order => order.userId === userId);
  },
};

// JSON-RPC endpoint for order service
app.post("/rpc", async (req, res) => {
  const { method, params, jsonrpc, id } = req.body;

  // Validate JSON-RPC version
  if (jsonrpc !== "2.0") {
    return res.json({
      jsonrpc: "2.0",
      error: {
        message: "The jsonrpc version didn't match",
      },
      id,
    });
  }

  // Find the RPC method to call
  const rpcMethodToCall = rpcMethods[method];
  if (!rpcMethodToCall) {
    return res.json({
      jsonrpc: "2.0",
      error: {
        message: "The method doesn't exist",
      },
      id,
    });
  }

  // Call the method and return the response
  const rpcResponse = await rpcMethodToCall(params);
  return res.json({
    jsonrpc: "2.0",
    id,
    result: rpcResponse,
  });
});

// Start the order service server
app.listen(PORT, () => {
  console.log(`Order Service started at http://localhost:${PORT}`);
});
