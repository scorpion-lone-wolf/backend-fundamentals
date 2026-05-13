# JSON-RPC with Jayson

This project shows how to use the `jayson` library to build a JSON-RPC server.

## What is different from the manual version?

In the manual version, you had to do many things by hand:

- parse the incoming request body
- decide which RPC method to call
- call the correct function
- format the response in JSON-RPC format

With `jayson`, most of that work is handled automatically.

## How Jayson works

When you create a `jayson.Server`, you pass an object with your RPC methods.
Jayson reads the incoming request and calls the right method for you.

### Example

```js
const server = new jayson.Server({
  add: function (args, callback) {
    callback(null, args[0] + args[1]);
  },
});
```

- `add` is the RPC method name.
- `args` contains the parameters sent by the client.
- `callback(null, result)` sends the response back.
- The first callback argument is the error. If there is no error, use `null`.

## Why this is easier

With Jayson:

- You do not need to create an Express server if you do not want to.
- You do not need to write your own method dispatcher.
- Jayson matches the `method` name from the request to your function.
- Jayson creates the correct JSON-RPC response structure.

## What Jayson still requires you to do

You still define:

- the list of RPC methods
- what each method does
- how the method returns data or errors

## Quick summary

### Manual JSON-RPC

You handled:

- request parsing
- routing (which method to call)
- dispatching (calling the right function)
- protocol formatting (building the JSON-RPC response)

### Jayson JSON-RPC

You handle:

- writing the RPC methods
- returning result or error using callback

Jayson handles:

- request parsing
- method routing
- dispatching
- JSON-RPC formatting

## Important concept

A JSON-RPC request looks like this:

```json
{
  "jsonrpc": "2.0",
  "method": "add",
  "params": [1, 2],
  "id": 1
}
```

A JSON-RPC response looks like this:

```json
{
  "jsonrpc": "2.0",
  "result": 3,
  "id": 1
}
```

That is the format Jayson helps you build automatically.

# ➡️ `JSON-RPC` vs `gRPC` – What Developers Should Know

A practical comparison for backend and microservices developers.

## Overview

**JSON-RPC** and **gRPC** are both popular for remote procedure calls, but they differ significantly in design, performance, and use cases.

---

## 1. Serialization

| Aspect             | JSON-RPC              | gRPC                      |
| ------------------ | --------------------- | ------------------------- |
| Format             | JSON (Text-based)     | Protocol Buffers (Binary) |
| Readability        | High (Human readable) | Low (Binary)              |
| Payload Size       | Larger                | Much smaller              |
| Performance        | Slower                | Significantly faster      |
| CPU & Memory Usage | High                  | Low                       |

**Key Takeaway**: gRPC is far more efficient for internal service-to-service communication due to binary serialization.

---

## 2. Schema & Contract

| Aspect          | JSON-RPC              | gRPC                                    |
| --------------- | --------------------- | --------------------------------------- |
| Schema          | Schema-less           | Strong schema (`.proto` files)          |
| Contract Design | No formal contract    | Contract-first design                   |
| Type Safety     | Weak (runtime checks) | Strong typing                           |
| Code Generation | Not available         | Excellent (multiple languages)          |
| Compatibility   | Manual management     | Built-in backward/forward compatibility |

**Key Takeaway**: gRPC reduces runtime errors and improves development speed with strong contracts and automatic code generation.

---

## 3. Transport Layer

| Feature               | JSON-RPC      | gRPC                     |
| --------------------- | ------------- | ------------------------ |
| Protocol              | HTTP/1.1      | HTTP/2                   |
| Multiplexing          | Not supported | Fully supported          |
| Streaming             | Limited       | Native support (4 types) |
| Header Compression    | No            | Yes (HPACK)              |
| Connection Efficiency | Lower         | High                     |

**Streaming Types in gRPC**:

- Unary (Request-Response)
- Server Streaming
- Client Streaming
- Bidirectional Streaming

---

## Quick Recommendation

| Use Case                       | Recommended Choice |
| ------------------------------ | ------------------ |
| Internal microservices         | **gRPC**           |
| High-performance / Low latency | **gRPC**           |
| Real-time streaming            | **gRPC**           |
| Public APIs (external clients) | JSON-RPC / REST    |
| Quick prototyping & debugging  | JSON-RPC           |

---

**Conclusion**:
**gRPC wins** for most modern backend systems due to better performance, strong contracts, efficient streaming, and superior scalability.

---
