//  client application(CLI) for our own protocol

import net from "node:net";
import readline from "node:readline/promises";

// Define the host and port of the server
const HOST = "localhost";
const PORT = 5000;

async function startChat() {
  // Create a readline interface for user input
  const rl = readline.createInterface({
    input: process.stdin, // terminal is the input source
    output: process.stdout, // terminal is the output source
    prompt: ">",
  });
  // Open a TCP connection to the server
  const clientConnection = net.createConnection({ host: HOST, port: PORT }, () => {
    // This runs after connection is established (TCP three-way handshake is complete)
    console.log(`Connected to server at ${HOST}:${PORT}`);
  });
  // Set the encoding so data is received as a string not as Buffer
  clientConnection.setEncoding("utf-8");

  //  Get usename and token from the user
  const username = await rl.question("\nEnter your username: ");
  const token = await rl.question("Enter your token: ");

  // Build the AUTH command
  const authCommand = buildCommand(
    "AUTH",
    {
      User: username,
      Token: token,
      "Content-Length": 0,
    },
    ""
  );
  // Send the AUTH command to the server so that server can authenticate the user and validate
  clientConnection.write(authCommand);

  // Handle data received from the server
  clientConnection.on("data", data => {
    const parsedMessage = parseMessage(data);
    if (!parsedMessage) {
      console.log("Invalid message from server");
      return;
    }
    const { command, responseFor, headers, body } = parsedMessage;

    if (command === "OK") {
      switch (responseFor) {
        case "AUTH":
          (async () => {
            const room = await rl.question("Enter room to join: ");
            const joinCommand = buildCommand("JOIN", { Room: room, "Content-Length": 0 }, "");
            clientConnection.write(joinCommand);
          })();
          break;
        case "JOIN":
          console.log("Joined room successfully");
          startSendingMessages(rl, clientConnection);
          break;
        case "LEAVE":
          console.log("You have left the room");
          clientConnection.end();
          break;
        default:
          console.log("Unknown response from server");
          break;
      }
    } else if (command === "ERROR") {
      console.log(`Error from server: ${body}`);
    } else if (command === "MESSAGE" || command === "JOIN" || command === "LEAVE") {
      let user = headers["User"] || "Server";
      console.log(`\n<${user}> ${body}`);
      rl.prompt();
    } else {
      console.log("Unknown command from server");
    }
  });

  // Handle connection end
  clientConnection.on("end", () => {
    console.log("Disconnected from server");
    rl.close(); // Close the readline interface
  });

  // Handle errors
  clientConnection.on("error", err => {
    console.error(`Connection error: ${err.message}`);
    rl.close(); // Close the readline interface on error
  });
}

async function startSendingMessages(rl, clientConnection) {
  rl.prompt();
  for await (const line of rl) {
    if (line === "/leave") {
      const leaveCommand = buildCommand("LEAVE", { "Content-Length": 0 }, "");
      clientConnection.write(leaveCommand);
      break;
    }
    const sendCommand = buildCommand("SEND", { "Content-Length": line.length }, line);
    clientConnection.write(sendCommand);
    rl.prompt();
  }
}

/**
  * FORMAT OF OUR PROTOCOL for AUTHENTICATION
  CHAT/1.0 AUTH
  User:alice
  Token:secret123
  Content-Length:0

  body
 */

function parseMessage(message) {
  const parts = message.split("\r\n\r\n");
  if (parts.length < 1) {
    return null;
  }

  const headerPart = parts[0];
  const body = parts[1] || "";

  const headerLine = headerPart.split("\r\n");
  if (headerLine.length === 0) return null;

  const firstLine = headerLine[0].split(" ");
  if (firstLine.length < 2) return null;

  const [protocolVersion, command] = firstLine;

  const headers = {};
  let responseFor = "";
  let contentLength = 0;
  for (let i = 1; i < headerLine.length; ++i) {
    const line = headerLine[i];
    const [key, value] = line.split(":");
    if (key && value) {
      headers[key.trim()] = value.trim();
      if (key.toLowerCase() === "response-for") {
        responseFor = value.trim();
      }

      if (key.toLowerCase() === "content-length") {
        contentLength = +value.trim();
      }
    }
  }

  return { protocolVersion, command, responseFor, headers, body };
}

function buildCommand(command, headers = {}, body = "") {
  const startLine = `CHAT/1.0 ${command}`;
  const headerLines = [];

  for (const key in headers) {
    const header = `${key}:${headers[key]}`;
    headerLines.push(header);
  }
  return `${startLine}\r\n${headerLines.join("\r\n")}\r\n\r\n${body}`;
}
startChat();