import jayson from "jayson";
// fake database of users

const users = [
  { id: 1, name: "John" },
  { id: 2, name: "Alice" },
  { id: 3, name: "Bob" },
];
// here we don't map rpcMethods manually,jayson automatically map methods name for us
const server = new jayson.Server({
  getAllUser: async function (args, callback) {
    // get all user from the database and return to client
    await new Promise(resolve => setTimeout(resolve, 2000)); // simulate a delay to demonstrate slow service.
    callback(null, users);
  },
  getUser: function (args, callback) {
    const { id } = args;
    // find the user with the given id and return to the client
    const user = users.find(user => user.id === id);
    callback(null, user);
  },
});
server.http().listen(4001);
console.log(`user service started at http://localhost:4001`);
