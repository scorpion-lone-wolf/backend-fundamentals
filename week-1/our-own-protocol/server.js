import net from "node:net";

// Define the host and port for the server to listen on
const HOST = "localhost";
const PORT = 5000;

const clients = [];
const rooms = {}; //  Store clients by room

// Create a TCP server
const server = net.createServer(socket => {
  console.log("New client connected");
  socket.setEncoding("utf-8");

  // Since scoket is just an JavaScript object, we can add custom properties to it
  // This property will help us track if the client is authenticated
  socket.authenticated = false;
  socket.joined = false;
  socket.username = "";
  socket.room = "";
  clients.push(socket);
  // Handle incoming data (in chunk) from the client
  socket.on("data", data => {
    console.log("Received data:", data);
    // parse the incoming data according to our protocol
    const parsedMessage = parseMessage(data);
    if (!parsedMessage) {
      console.error("Invalid Message Format");
      return;
    }
    console.log("Parsed message:", parsedMessage);
    handleMessage(socket, parsedMessage);
  });

  // Handle client disconnection
  socket.on("end", () => {
    console.log("Client disconnected");
    if (socket.joined) {
      handleLeave(socket);
    }
    const index = clients.indexOf(socket);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });

  // Handle errors
  socket.on("error", err => {
    console.error(`Socket error: ${err.message}`);
  });
});

// Start the server and listen on the specified host and port
server.listen(PORT, HOST, () => {
  console.log(`Server listening on ${HOST}:${PORT}`);
});

// Handle server errors
server.on("error", err => {
  console.error(`Server error: ${err.message}`);
});

function handleMessage(socket, parsedMessage) {
  console.log(`Handling command: ${parsedMessage.command}`);
  if (!socket.authenticated && parsedMessage.command !== "AUTH") {
    socket.write(
      formatResponse("ERROR", "GENERAL", { "Content-Length": 19 }, "Authentication required")
    );
    return;
  }

  const command = parsedMessage.command;
  switch (command) {
    case "AUTH":
      handleAuth(socket, parsedMessage);
      break;
    case "JOIN":
      handleJoin(socket, parsedMessage);
      break;
    case "SEND":
      handleSend(socket, parsedMessage);
      break;
    case "LEAVE":
      handleLeave(socket);
      break;
    default:
      socket.write(formatResponse("ERROR", "GENERAL", { "Content-Length": 15 }, "Unknown command"));
      break;
  }
}

function handleAuth(socket, parsedMessage) {
  // get users and token from headers
  const user = parsedMessage.headers["User"];
  const token = parsedMessage.headers["Token"];

  //  validating users and token
  //  TODO: Store the token somewhere else like in db
  if (user && token && token === "secret123") {
    console.log(`Authenticating user: ${user}`);
    socket.authenticated = true;
    socket.username = user;
    socket.write(formatResponse("OK", "AUTH", { "Content-Length": 0 }, ""));
    console.log(`User ${user} authenticated`);
  } else {
    console.log(`Authentication failed for user: ${user}`);
    socket.write(
      formatResponse("ERROR", "AUTH", { "Content-Length": 25 }, "Invalid username or token")
    );
    socket.end();
  }
}

function handleJoin(socket, parsedMessage) {
  if (socket.joined) {
    socket.write(
      formatResponse("ERROR", "JOIN", { "Content-Length": 21 }, "You are already in a room")
    );
    return;
  }

  const room = parsedMessage.headers["Room"];
  if (!room) {
    socket.write(formatResponse("ERROR", "JOIN", { "Content-Length": 15 }, "Room not specified"));
    return;
  }

  console.log(`User ${socket.username} joining room: ${room}`);
  socket.joined = true;
  socket.room = room;

  // rooms will be objects of arrays.
  //  {
  //   123: [];
  //   anything:[];
  //   somethingelse:[];
  //   ...
  // }
  if (!rooms[room]) {
    rooms[room] = [];
  }
  rooms[room].push(socket);

  socket.write(formatResponse("OK", "JOIN", { "Content-Length": 0 }, ""));
  broadcast(
    socket,
    formatBroadcast("JOIN", { "Content-Length": 0 }, `${socket.username} has joined the room`)
  );
  console.log(`User ${socket.username} joined room: ${room}`);
}

function handleSend(socket, parsedMessage) {
  if (!socket.joined) {
    socket.write(
      formatResponse("ERROR", "SEND", { "Content-Length": 25 }, "You are not in a room")
    );
    return;
  }
  console.log(`User ${socket.username} sending message: ${parsedMessage.body}`);
  broadcast(
    socket,
    formatBroadcast(
      "MESSAGE",
      { "Content-Length": parsedMessage.body.length },
      parsedMessage.body,
      socket.username
    )
  );
  console.log(`Message from ${socket.username} broadcasted`);
}

function handleLeave(socket) {
  if (!socket.joined) {
    socket.write(
      formatResponse("ERROR", "LEAVE", { "Content-Length": 25 }, "You are not in a room")
    );
    return;
  }
  const room = socket.room;
  console.log(`User ${socket.username} leaving room: ${room}`);
  broadcast(
    socket,
    formatBroadcast("LEAVE", { "Content-Length": 0 }, `${socket.username} has left the room`)
  );

  socket.write(formatResponse("OK", "LEAVE", { "Content-Length": 0 }, ""));
  socket.joined = false;
  socket.room = "";

  if (rooms[room]) {
    const index = rooms[room].indexOf(socket);
    if (index !== -1) {
      rooms[room].splice(index, 1);
    }
  }
  console.log(`User ${socket.username} left room: ${room}`);
}

function broadcast(senderSocket, message) {
  const room = senderSocket.room;
  console.log(`Broadcasting message to room: ${room}`);
  if (rooms[room]) {
    for (const client of rooms[room]) {
      if (client !== senderSocket) {
        client.write(message);
      }
    }
  }
}

function formatResponse(command, responseFor, headers, body) {
  const startLine = `CHAT/1.0 ${command}`;
  const headerLines = [];
  headerLines.push(`Response-For:${responseFor}`);

  for (const key in headers) {
    headerLines.push(`${key}:${headers[key]}`);
  }
  return `${startLine}\r\n${headerLines.join("\r\n")}\r\n\r\n${body}`;
}

function formatBroadcast(command, headers, body, user) {
  const startLine = `CHAT/1.0 ${command}`;
  const headerLines = [];

  if (user) {
    headerLines.push(`User:${user}`);
  }

  for (const key in headers) {
    headerLines.push(`${key}:${headers[key]}`);
  }
  return `${startLine}\r\n${headerLines.join("\r\n")}\r\n\r\n${body}`;
}

function parseMessage(message) {
  const parts = message.split("\r\n\r\n");
  if (parts.length < 2) {
    return null;
  }

  const headerPart = parts[0];
  const body = parts[1];

  const headerLine = headerPart.split("\r\n");
  if (headerLine.length === 0) return null;

  const firstLine = headerLine[0].split(" ");
  if (firstLine.length < 2) return null;

  const [protocolVersion, command] = firstLine;

  const headers = {};
  let contentLength = 0;
  for (let i = 1; i < headerLine.length; ++i) {
    const line = headerLine[i];
    const [key, value] = line.split(":");
    headers[key] = value;

    if (key.toLowerCase() === "content-length") {
      contentLength = +value;
    }
  }
  // This check is not great because the body can contain newlines
  // and the content-length might not match the body length if the
  // body is read in chunks.
  // if (body.length !== contentLength) {
  //   console.warn(`Warning: body length ${body.length} does not match content length header.`);
  // }
  return { protocolVersion, command, headers, body };
}
