import fsPromises from "node:fs/promises";
import path from "node:path";

let counter = 0;

export async function logger() {
  // this function will log some random text to a app.log file after every 10 sec
  makeDir("./log");
  const filePath = path.join("log", "app.log");
  const contentOfFile = `This is the Content and this is appended at last : ${++counter}\n`;
  await fsPromises.appendFile(filePath, contentOfFile);
  console.log("Content appended Successfully");
}

async function makeDir(folderPath) {
  try {
    await fsPromises.mkdir(folderPath, { recursive: true });
  } catch (error) {
    console.log("error creating folder", error.message);
  }
}
