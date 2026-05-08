import { FileStore } from "@tus/file-store";
import { Server } from "@tus/server";
import express from "express";

const app = express();

const tusServer = new Server({
  path: "/files",
  datastore: new FileStore({
    directory: "./files",
  }),
});

app.use("/uploaded-files", express.static("files"));
app.use(express.static("public"));
// Handle ALL tus routes
app.all("/files{*path}", async (req, res) => {
  await tusServer.handle(req, res);
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
