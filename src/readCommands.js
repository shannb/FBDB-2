"use strict";
exports.__esModule = true;
exports.recursiveAsyncReadLine = void 0;
var readline = require("readline");
var fbdb_1 = require("./fbdb");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var cp = new fbdb_1.CommandProcessor();
function recursiveAsyncReadLine() {
    rl.question('Enter DB Command > ', function (answer) {
        var command = answer.split(' ')[0];
        if (command === 'END')
            return rl.close();
        else
            console.log(cp.processInput(answer) || '');
        recursiveAsyncReadLine();
    });
}
exports.recursiveAsyncReadLine = recursiveAsyncReadLine;
;
