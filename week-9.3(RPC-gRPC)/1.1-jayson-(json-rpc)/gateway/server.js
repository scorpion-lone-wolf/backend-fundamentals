import express from "express";
import jayson from "jayson";

const app = express();
const PORT = 4000;

// create jayson RCP client
// this userClient is an RPC client abstration to connect to user service.
const userClient = jayson.Client.http({
  port: 4001, // user service port
});

// this orderClient is an RPC client abstration to connect to order service.
const orderClient = jayson.Client.http({
  port: 4002, // order service port
});
// route to handle request from frontend
app.get("/user/:id", async (req, res) => {
  const userId = +req.params.id;
  // call user service using RPC client
  const userPromise = new Promise((resolve, reject) => {
    userClient.request("getUser", { id: userId }, function (err, response) {
      if (err) {
        return reject(err);
      }
      return resolve(response.result);
    });
  });

  // call order service using RPC client
  const orderPromise = new Promise((resolve, reject) => {
    orderClient.request("getOrdersByUserId", { userId: userId }, function (err, response) {
      if (err) {
        console.log("Order Service unavailable");
        return resolve([]);
      }
      return resolve(response.result);
    });
  });

  const [user, orders] = await Promise.all([userPromise, orderPromise]);
  return res.json({
    user,
    orders,
  });
});

app.listen(PORT, () => {
  console.log(`Gateway Started at http://localhost:4000`);
});
