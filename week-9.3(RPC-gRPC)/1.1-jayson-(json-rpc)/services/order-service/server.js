import jayson from "jayson";
// orders data simulation
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

const server = new jayson.Server({
  getOrdersByUserId: function (args, callback) {
    const { userId } = args;
    const userOrderedItems = orders.filter(order => order.userId === userId);
    callback(null, userOrderedItems);
  },
});

server.http().listen(4002);
console.log("Order Service running on 4002");
