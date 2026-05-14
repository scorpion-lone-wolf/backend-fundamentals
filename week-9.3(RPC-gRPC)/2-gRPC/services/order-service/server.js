import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "node:path";

const PORT = 4002;
const __dirname = import.meta.dirname;

// load the package definition
const packageDefinition = protoLoader.loadSync(path.join(__dirname, "../../proto/order.proto"));
const orderProto = grpc.loadPackageDefinition(packageDefinition).order;

// fake data for orders
const orders = [
  { id: 1, items: "Laptop", price: 999.99, user_id: 1 },
  { id: 2, items: "Mouse", price: 4.99, user_id: 1 },
  { id: 3, items: "Keyboard", price: 10.99, user_id: 2 },
  { id: 4, items: "Iphone", price: 599.99, user_id: 1 },
];
// grpC methods implementaion

function getOrderByUserId(call, callback) {
  const { userId } = call.request;
  const userOrders = orders.filter(order => order.user_id === userId);
  callback(null, { orders: [...userOrders], status: "Success" });
}
// create a service ,add service to the server and bind the port
const server = new grpc.Server();
server.addService(orderProto.OrderService.service, {
  GetUsersOrders: getOrderByUserId,
});
server.bindAsync(`localhost:${PORT}`, grpc.ServerCredentials.createInsecure(), () => {
  console.log("Order service started on port:", PORT);
});
