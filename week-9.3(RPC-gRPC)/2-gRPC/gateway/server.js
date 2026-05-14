import path from "node:path";

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import express from "express";

const app = express();

const __dirname = import.meta.dirname;
const PORT = 4000;

// load proto file and create userProto grpc object
//  this loads gprc contract and create a gRPC object.
const userPackageDefinition = protoLoader.loadSync(path.join(__dirname, "../proto/user.proto"), {
  defaults: true, // force the default value for fileds to appear.
});
const userProto = grpc.loadPackageDefinition(userPackageDefinition).user;

const orderPackageDefinition = protoLoader.loadSync(path.join(__dirname, "../proto/order.proto"), {
  defaults: true, // force the default value for fileds to appear.
});
const orderProto = grpc.loadPackageDefinition(orderPackageDefinition).order;

// create a gRPC client stub that connects to the gRPC server at localhost:4001
const userClient = new userProto.UserService(
  "localhost:4001",
  grpc.credentials.createInsecure() // use insecure for development
);
const orderClient = new orderProto.OrderService(
  "localhost:4002",
  grpc.credentials.createInsecure() // use insecure for development
);

// REST API route for frontend
app.get("/user/:id", async (req, res) => {
  const userId = +req.params.id;
  try {
    const userPromise = new Promise((resolve, reject) => {
      userClient.GetUser(
        {
          id: userId,
        },
        (err, response) => {
          if (err) {
            return reject(err);
          }

          return resolve(response);
        }
      );
    });
    const orderPromise = new Promise((resolve, reject) => {
      orderClient.GetUsersOrders({ userId: userId }, (err, response) => {
        if (err) {
          return reject(err);
        }

        return resolve(response);
      });
    });
    const [user, orders] = await Promise.all([userPromise, orderPromise]);
    return res.json({
      user: user,
      orders: orders,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log("Gateway started at port :", PORT);
});
