import * as fs from "fs";
import { FlashFileParser } from "./flashfile.js";

// node testflashfile.js flashfile.txt
const main = () => {
  if (process.argv.length < 3) {
    console.log("Usage: node ffencode.js flatfile.txt");
    return;
  }
  let parser = new FlashFileParser();
  let flashes = parser.tokenize(fs.readFileSync(process.argv[2], "utf8"));
  //console.log(flashes.join(" "));
  let encoded = parser.encode(flashes, false, false); // keep order, use invader format (false gains leading 0 on 0 to 9 numbers) 
  console.log(encoded.join(" "));
}

main();