# gRPC User Service

This project shows how to build a simple gRPC service in Node.js.

## What is gRPC?

gRPC is a way for two programs to talk to each other using a shared contract.
The contract is defined in a `.proto` file.

### Why use gRPC?

- The contract defines exactly what methods are available.
- The request and response formats are fixed and typed.
- gRPC uses a compact binary format, not plain JSON.
- Clients can be generated automatically in many languages.

## Project structure

- `proto/user.proto` — the shared contract for the user service
- `services/user-service/server.js` — the gRPC server implementation
- `readme.md` — this documentation

## What is in `proto/user.proto`?

This file defines the user service interface:

```proto
syntax = "proto3";

package user;

service UserService {
  rpc GetUser(GetUserRequest) returns (User);
}

message GetUserRequest {
  int32 id = 1;
}

message User {
  int32 id = 1;
  string name = 2;
}
```

### Key points

- `service UserService` defines the RPC methods.
- `rpc GetUser(GetUserRequest) returns (User)` means the client sends a `GetUserRequest` and receives a `User`.
- `message` blocks define the structure of request and response data.

## How the server works

In `services/user-service/server.js`:

1. Load the proto contract using `@grpc/proto-loader`.
2. Convert the contract into usable gRPC objects with `@grpc/grpc-js`.
3. Implement the `GetUser` method in JavaScript.
4. Register the service on a gRPC server.
5. Start the server on `localhost:4001`.

## Why this is important

The `.proto` file is the contract between the client and server.
It means both sides agree on:

- method names
- parameter types
- response types

This makes communication predictable and safer.

## Why use Protocol Buffers?

- JSON is text and larger in size.
- Protobuf is binary and smaller.
- gRPC uses Protobuf by default in many cases.

## Packages used

```bash
npm install @grpc/grpc-js @grpc/proto-loader
```

- `@grpc/grpc-js` — the actual gRPC implementation for Node.js
- `@grpc/proto-loader` — loads the `.proto` file into JavaScript objects

## What is a gRPC client stub?

A client stub is a small helper object that makes calling a remote service look like a normal local function call.

- The stub is created from the `.proto` contract.
- It knows the method name, request type, and response type.
- The client uses the stub to call the server method, for example:

```js
const client = new userProto.UserService("localhost:4001", gRPC.credentials.createInsecure());
client.GetUser({ id: 1 }, (error, response) => {
  if (error) {
    console.error("gRPC error:", error);
  } else {
    console.log("User:", response);
  }
});
```

The client does not need to build the request format manually. The stub sends the request in the right gRPC/Protobuf format.

## Server vs Client in gRPC

### Server

- Loads the `.proto` contract.
- Implements the service methods in code.
- Registers methods on a gRPC server.
- Listens for incoming gRPC requests.
- Returns the response or an error.

### Client

- Loads the same `.proto` contract.
- Creates a stub for the service.
- Calls remote methods with normal-looking function calls.
- Receives the response or an error callback.

The important idea is that both client and server use the same contract file. The server implements the logic, and the client calls the logic remotely.

## Important terms

- **Contract**: the shared API definition in the `.proto` file
- **Service**: a set of RPC methods defined in the proto
- **RPC method**: a remote function call like `GetUser`
- **Client**: the program that calls the service
- **Server**: the program that implements the service

## How to run the user service

```bash
cd services/user-service
npm install
node server.js
```

The server will listen on `localhost:4001`.

## Example gRPC flow

1. Client builds a request with `id`.
2. gRPC sends the request to `GetUser`.
3. Server looks up the user in the fake database.
4. Server returns the user object or an error.

## Simple summary

- gRPC is a contract-first RPC system.
- The `.proto` file is the contract.
- The server code loads the contract, implements the method, and starts the service.
- The user service here is just one example of a gRPC server.
