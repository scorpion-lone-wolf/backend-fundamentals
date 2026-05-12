import axios from "axios";

// Function to make JSON-RPC calls to microservices
export async function callRPC({ serviceURL, method, params }) {
  try {
    // Send JSON-RPC request using axios
    const rpcResponse = await axios.post(
      serviceURL,
      {
        method,
        params,
        jsonrpc: "2.0",
        id: Date.now(), // Unique request ID
      },
      {
        timeout: 3000, // Timeout after 3 seconds to prevent hanging
      }
    );

    // Check if the RPC response contains an error
    if (rpcResponse.data.error) {
      throw new Error(rpcResponse.data.error.message);
    }

    // Return the result from the RPC call
    return rpcResponse.data.result;
  } catch (error) {
    throw error;
  }
}
