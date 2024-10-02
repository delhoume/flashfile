class FlashFileParser {
    current_city_code;
    current_list;
    constructor() { }

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

    items(contents) {
        let tokens = this.tokenize(contents);
        return this.decode(tokens);
    }

    decode(tokens) {
        this.current_list = [];
        for (let c = 0; c < tokens.length; ++c) {
            let command = tokens[c];
            if (command.indexOf("_") != -1) {
                let parts = command.split("_");
                this.current_city_code = parts[0];
                console.log(parts);
                this.handleOrderToken(parts[1].trim());
            } else {
                this.handleOrderToken(command.trim());
            }
        }
        return this.current_list;

    }

    printInvaderNumber(num) {
        if (num < 10) return "0" + num;
        else return num;
    }

    handleOrderToken(order) {
        if (order.length == 0) return;
        let start, end;
        if (order.indexOf(",") != -1) { // we have an absolut range
            let bounds = order.split(",");
            start = Number(bounds[0]);
            end = Number(bounds[1]);
            if (end >= start)
                this.handleRelativeOrderRange(start, end - start + 1);
            else
                console.log("eerroro");
        } else if (order.indexOf("+") != -1) {
            let bounds = order.split("+");
            start = Number(bounds[0]);
            let len = Number(bounds[1]);
            this.handleRelativeOrderRange(start, len + 1)
        } else { /// single number
            let num = Number(order)
            console.log(num);
            this.handleRelativeOrderRange(num, 1);
        }
    }
    handleRelativeOrderRange(r1, len) {
        for (let l = 0; l < len; ++l) {
            let full_code = this.current_city_code + "_" + this.printInvaderNumber(r1 + l);
            if (!this.current_list.includes(full_code)) this.current_list.push(full_code);
        }
    }
}


export { FlashFileParser }