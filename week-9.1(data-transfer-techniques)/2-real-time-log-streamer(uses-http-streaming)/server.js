import express from "express";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
import { logger } from "./logger.js";
const LOG_DIR = "./log";
const LOG_FILE = path.join(LOG_DIR, "app.log");

const app = express();

// Serve static files from the public folder.
app.use(express.static("public"));

// Generate log entries every 10 seconds using the logger helper.
setInterval(async () => {
  await logger();
}, 10 * 1000);

// Ensure the log directory exists before using it.
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}
// Ensure the log file exists before watching or reading it.
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, "");
}

// Server-Sent Events (SSE) endpoint that streams new log data.
app.get("/get-log", async (req, res) => {
  // Required headers for SSE
  res.set({
    "Content-Type": "text/event-stream", // tells the client this is an SSE stream
    Connection: "keep-alive", // keep the HTTP connection open
    "Cache-Control": "no-cache", // do not cache streamed data
  });

  // Because the Express may buffer the header , so we are immediately flushing the SSE header to create a connection
  res.flushHeaders(); //flush the header
  //   let previousFileSize = 0; // This will make sure SSE happens from starting of the file
  let previousFileSize = (await fsPromises.stat(LOG_FILE)).size;

  const watcher = fs.watch(LOG_FILE, async event => {
    if (event === "change") {
      const currentFileSize = (await fsPromises.stat(LOG_FILE)).size;

      // If file size did not grow, there is no new data to send.
      if (currentFileSize <= previousFileSize) {
        return;
      }

      // Read only the newly appended portion of the file.
      const readableStream = fs.createReadStream(LOG_FILE, {
        start: previousFileSize,
        end: currentFileSize - 1,
      });

      /**
       * For SSE, each event must be sent in the format:
       * data: <message>\n\n
       * Therefore we collect the new file content first and then send it.
       */
      let chunkedData = "";
      readableStream.on("data", chunk => {
        chunkedData += chunk.toString();
      });

      readableStream.on("end", () => {
        previousFileSize = currentFileSize;
        res.write(`data: ${JSON.stringify(chunkedData)}\n\n`);
      });
    }
  });

  // When the client disconnects, stop watching the file and close the response.
  req.on("close", () => {
    watcher.close();
    res.end();
  });
});

app.listen(8080, () => {
  console.log(`Server started at http://localhost:8080`);
});
