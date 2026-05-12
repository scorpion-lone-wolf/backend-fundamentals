import cors from "cors";
import express from "express";

const app = express();
// This will parse the incoming json body
app.use(express.json());
app.use(cors());
const PORT = 4001;

// Fake database for users
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Alice" },
];

// Define RPC methods that can be called remotely
const rpcMethods = {
  getAllUser: () => {
    return users;
  },
  getUser: ({ id }) => {
    return users.find(user => user.id == id);
  },
};

// JSON-RPC endpoint that handles remote procedure calls
app.post("/rpc", (req, res) => {
  // Extract JSON-RPC request structure from body
  const { id, method, params, jsonrpc } = req.body;

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

  // Find the RPC method to call based on the method name from client
  const rpcMethodToCall = rpcMethods[method];
  if (!rpcMethodToCall) {
    return res.json({
      jsonrpc: "2.0",
      error: {
        message: "Method not found",
      },
      id,
    });
  }

  // Call the method and return the result
  try {
    const result = rpcMethodToCall(params);
    return res.json({
      jsonrpc: "2.0",
      result: result,
      id,
    });
  } catch (error) {
    return res.json({
      jsonrpc: "2.0",
      error: {
        message: error.message,
      },
      id,
    });
  }
});

// Start the user service server
app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
