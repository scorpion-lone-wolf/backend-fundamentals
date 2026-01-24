import net from "node:net";

const clients = [];

const server = net.createServer(socket => {
  console.log("Client connected...\n");
  // storing client socket
  clients.push(socket);
  console.log(`Total connected clients : ${clients.length}`);

  socket.write("Welcome to Our TCP server!\n");
  socket.write("Type your message and hit enter\n");

  // receiving data in the form of chunk from client
  socket.on("data", chunk => {
    const message = chunk.toString().trim();
    // send this message to all clients except the sendeer
    clients.forEach(client => {
      if (client !== socket) {
        client.write(`Message from client: ${message}\n`);
      }
    });
  });

  socket.on("end", () => {
    // remove the client from the list when it disconnects
    const index = clients.indexOf(socket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
    console.log("Client disconnected...\n");
    console.log(`Total connected clients : ${clients.length}`);
  });
});

server.on("error", err => {
  console.error("Server error:", err);
});

server.listen(8080, () => {
  console.log("Server listening on port 8080");
});
