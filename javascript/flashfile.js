import { Cities } from "./cities.js";


class FlashFileParser {
    constructor() {}

    tokenize(contents) {
        let tokens = [];
        let lines = contents.split("\n");
        for (let l = 0; l < lines.length; ++l) {
            let line = lines[l];
            let comment_pos = line.indexOf('#');
            if (comment_pos != -1)
                line = line.substring(0, comment_pos);
            let words = line.split(" ");
            for (let w = 0; w < words.length; ++w) {
                let good_word = words[w].trim();
                if (good_word.length > 0) {
                    tokens.push(good_word);
                }
            }
        }
        return tokens;
    }
    flashes(contents) {
        let tokens = this.tokenize(contents);
        return this.decode(tokens);
    }

    decode(tokens) {
        let flashes = [];
        let city_code;
        let manco_mode;
        for (let c = 0; c < tokens.length; ++c) {
            let command = tokens[c];
            if (command.indexOf("_") != -1) { // we have a city (always add)
                let parts = command.split("_");
                city_code = parts[0];
                manco_mode = false;
                let range = parts[1];
                let start, end;
                if (range.indexOf(",") != -1) { // we have a range
                    let bounds = range.split(",");
                    start = Number(bounds[0]);
                    end = Number(bounds[1]);
                    for (let n = start; n <= end; ++n) {
                        this.add(city_code + "_" + this.printInvaderNumber(n), flashes);
                    }
                } else {  /// single number
                    this.add(city_code + "_" + this.printInvaderNumber(Number(range)), flashes)
                }
            } else { // can be a range or single number or city
                if (command.indexOf(",") != -1) {
                    let bounds = command.split(",");
                    let start = Number(bounds[0]);
                    let end = Number(bounds[1]);
                    for (let n = start; n <= end; ++n) {
                        let si_code = city_code + "_" + this.printInvaderNumber(n);
                        if (manco_mode == true) {
                            this.remove(si_code, flashes);
                        } else {
                            this.add(si_code, flashes);
                        }
                    }
                } else if (command in Cities) { // single city, manco mode
                    city_code = command;
                    manco_mode = true;
                    let invaders = Cities[city_code]['invaders'];
                    let start = Cities[city_code]['start'];
                    for (let c = 0; c < invaders; ++c) {
                        this.add(city_code + "_" + this.printInvaderNumber(start + c), flashes);
                    }
                } else {
                    let num = Number(command);
                    let code = city_code + "_" + this.printInvaderNumber(num)
                    if (manco_mode == true) {
                        this.remove(code, flashes)
                    } else {
                        this.add(code, flashes)
                    }
                }
            }
        }
        return flashes;
    }

    printInvaderNumber(num) {
        if (num < 10) return "0" + num;
        else return num;
    }

    add(si, flashes) {
        if (!flashes.includes(si))
            flashes.push(si);
    }

    remove(si, flashes) {
        let idx = flashes.indexOf(si);
        if (idx > -1) flashes.splice(idx, 1);
    }
}


export { FlashFileParser }