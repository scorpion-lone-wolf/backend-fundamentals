import udp from "node:dgram";
// create a udp server
const udpServer = udp.createSocket("udp4");

//  handling error from server
udpServer.on("error", err => {
  console.error("UDP server error:", err);
  udpServer.close();
});

//  handling receive message from client
udpServer.on("message", (msg, rinfo) => {
  console.log(`Received message from ${rinfo.address}:${rinfo.port}: ${msg.toString()}`);
  //   sending message to client after receiving msg from client
  udpServer.send(`Hello Client : ${msg}`, rinfo.port, rinfo.address, err => {
    if (err) {
      console.error("Error sending message:", err);
    } else {
      console.log("Echoed message back to the client");
    }
  });
});

// handling close
udpServer.on("close", () => {
  console.log("UDP server closed");
});

udpServer.on("listening", () => {
  const address = udpServer.address();
  console.log(`UDP server listening on ${address.address}:${address.port}`);
});

// binding udp server to a port
udpServer.bind(41223);
