"use strict";
exports.__esModule = true;
exports.recursiveAsyncReadLine = void 0;
var readline = require("readline");
var fbdb_1 = require("./fbdb");
var db_1 = require("./db");
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
var CommandGenerator = /** @class */ (function () {
    function CommandGenerator() {
        this.command = "";
    }
    CommandGenerator.prototype.generateCommand = function (strCmd) {
        var strCmdArr = strCmd.split(' ');
        var command = {
            command: strCmdArr[0],
            key: strCmdArr[1] || '',
            value: strCmdArr[2] || null
        };
        if (strCmdArr[0] === db_1.DB_COMMAND.NUMEQUALTO) {
            command.value = strCmdArr[1];
            command.key = '';
        }
        return command;
    };
    return CommandGenerator;
}());
var db = new fbdb_1.Database();
function recursiveAsyncReadLine() {
    var cg = new CommandGenerator();
    rl.question('Enter DB Command > ', function (answer) {
        var command = answer.split(' ')[0];
        var generatedCommand = cg.generateCommand(answer);
        switch (command) {
            case "SET":
                db.set(generatedCommand);
                break;
            case 'GET':
                var value = db.get(generatedCommand);
                console.log(value);
                break;
            case 'UNSET':
                db.unset(generatedCommand);
                break;
            case 'NUMEQUALTO':
                var equalTo = db.numEqualTo(generatedCommand);
                console.log(equalTo);
                break;
            case 'BEGIN':
                break;
            case 'COMMIT':
                break;
            case 'END':
                break;
            default:
                console.log('Invalid Command!');
                break;
        }
        if (command === 'END')
            return rl.close();
        recursiveAsyncReadLine(); //Calling this function again to ask new question
    });
}
exports.recursiveAsyncReadLine = recursiveAsyncReadLine;
;
