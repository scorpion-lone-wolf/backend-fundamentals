import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "node:path";

const PORT = 4001;
const __dirname = import.meta.dirname;

// Step 1: Load the .proto contract file and parse it into JavaScript.
// The .proto file defines the service, methods, request, and response schema.
const packageDefinition = protoLoader.loadSync(path.join(__dirname, "../../proto/user.proto"), {
  defaults: true, // force the default value for fileds to appear.
});

// Step 2: Convert the loaded proto definition into a usable gRPC object.
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

// Fake in-memory database for demo purposes.
const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Alice" },
];

// gRPC method implementation for GetUser.
// gRPC passes a `call` object and a `callback` function.
function getUser(call, callback) {
  // The request fields come from the proto definition.
  const userId = call.request.id;

  const user = users.find(user => user.id === userId);

  if (user) {
    // Send success response with the user object.
    callback(null, { user: [user], staus: "successs" });
  } else {
    // Send a gRPC error response when user is not found.
    // callback({
    //   code: gRPC.status.NOT_FOUND,
    //   message: "User not found",
    // });
    callback(null, { user: [], staus: "successs" });
  }
}

// Create the gRPC server and register the service implementation.
const server = new grpc.Server();
server.addService(userProto.UserService.service, {
  GetUser: getUser,
});

// Bind the server to localhost:4001 and start it.
server.bindAsync(`localhost:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log("User service started on port:", PORT);
});
