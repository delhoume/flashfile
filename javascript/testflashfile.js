import * as fs from "fs";
import { FlashFileParser } from "./flashfile.js";

// node testflashfile.js flashfile.txt
const main = () => {
  if (process.argv.length < 3) {
    console.log("Usage: node testflashfile.js flashfile.txt");
    return;
  }
  let parser = new FlashFileParser();
  let flashes = parser.items(fs.readFileSync(process.argv[2], "utf8"));
  console.log(flashes.join("\n"));
}

main();