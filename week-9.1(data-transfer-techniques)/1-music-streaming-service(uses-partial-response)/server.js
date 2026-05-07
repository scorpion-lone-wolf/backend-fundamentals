import express from "express";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
const app = express();
// Middleware to server public folder
app.use(express.static("public"));

app.get("/video", async (req, res) => {
  const filePath = "./How Doubt Kills Your Luck (Bhagawad Gita, Upanishads, Stoicism)_480p.mp4";
  // getting the file size
  let fileSize = 0;
  try {
    fileSize = (await fsPromises.stat(filePath)).size;
  } catch (error) {
    return res.status(404).send("File not found");
  }
  // extracting the range header
  const rangeValue = req.headers?.range;
  try {
    if (rangeValue) {
      const { start, end } = parseRangeHeader(rangeValue, fileSize);
      const chunkSize = end - start + 1;
      const readableVideoStream = await fs.createReadStream(filePath, { start, end });

      res.set("Content-Type", "video/mp4");
      res.set("Content-Length", chunkSize);
      res.set("Accept-Ranges", "bytes");
      res.set("Content-Range", `bytes ${start}-${end}/${fileSize}`);
      res.status(206); // 206 for partial content

      readableVideoStream.pipe(res);
    } else {
      const readableVideoStream = fs.createReadStream(filePath);

      res.set("Content-Type", "video/mp4");
      res.set("Content-Length", fileSize);
      res.status(200);
      readableVideoStream.pipe(res);
    }
  } catch (error) {
    console.error("Error In /video : ", error.message);
    return res.status(400).send("Bad Request");
  }
});

// extract start and end byte from range string
function parseRangeHeader(rangeString, fileSize) {
  if (!rangeString.startsWith("bytes=")) {
    throw new Error("Range header is not valid");
  }
  const rangeArray = rangeString.split("=")[1].split("-");
  return {
    start: parseInt(rangeArray[0], 10),
    end: rangeArray[1] ? parseInt(rangeArray[1], 10) : fileSize - 1,
  };
}

app.listen(8080, () => {
  console.log(`Server Started on http://localhost:${8080}`);
});
