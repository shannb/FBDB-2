"use strict";
exports.__esModule = true;
exports.CommandProcessor = exports.Database = void 0;
var db_1 = require("./db");
var Database = /** @class */ (function () {
    function Database() {
        this.dataStore = new Map();
        this.valueStore = new Map();
    }
    Database.getInstance = function () {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    };
    Database.prototype.get = function (cmd) {
        var value = this.dataStore.get(cmd.key) || "";
        return value;
    };
    Database.prototype.set = function (cmd) {
        if (!cmd.value)
            return false;
        this.dataStore.set(cmd.key, cmd.value);
        var valFreq = this.valueStore.get(cmd.value);
        if (valFreq === undefined)
            this.valueStore.set(cmd.value, 1);
        else
            this.valueStore.set(cmd.value, valFreq + 1);
        return true;
    };
    Database.prototype.unset = function (cmd) {
        var value = this.get(cmd);
        if (value != undefined) {
            var valFreq = this.valueStore.get(value) || 0;
            if (valFreq > 0)
                this.valueStore.set(value, valFreq - 1);
        }
        this.dataStore["delete"](cmd.key);
        return true;
    };
    Database.prototype.numEqualTo = function (cmd) {
        if (!cmd.value)
            throw Error("Error while executing NUMEQUALTO");
        var valFreq = this.valueStore.get(cmd.value) || 0;
        return valFreq;
    };
    Database.prototype.commit = function (commands) {
        var _this = this;
        commands.forEach(function (dbCmd) {
            switch (dbCmd.command) {
                case "SET":
                    _this.set(dbCmd);
                    break;
                case "GET":
                    _this.get(dbCmd);
                    break;
                case "UNSET":
                    _this.unset(dbCmd);
                    break;
                default:
                    break;
            }
        });
    };
    return Database;
}());
exports.Database = Database;
var CommandProcessor = /** @class */ (function () {
    function CommandProcessor() {
        this.command = "";
        this.transMgr = new TransactionMgr();
        this.transactionInProgress = false;
    }
    CommandProcessor.prototype.generateCommand = function (strCmd) {
        var strCmdArr = strCmd.split(' ');
        var command = {
            command: strCmdArr[db_1.INPUT_VALUE_IDX.COMMAND],
            key: strCmdArr[db_1.INPUT_VALUE_IDX.KEY_OR_NUMEQUAL_VAL] || '',
            value: strCmdArr[db_1.INPUT_VALUE_IDX.VALUE] || null
        };
        if (strCmdArr[db_1.INPUT_VALUE_IDX.COMMAND] === db_1.DB_COMMAND.NUMEQUALTO) {
            command.value = strCmdArr[db_1.INPUT_VALUE_IDX.KEY_OR_NUMEQUAL_VAL];
            command.key = '';
        }
        return command;
    };
    CommandProcessor.prototype.processInput = function (cmdStr) {
        var inputCmd = this.generateCommand(cmdStr);
        if (inputCmd.command === db_1.DB_COMMAND.ROLLBACK &&
            this.transactionInProgress === false) {
            return "NO TRANSACTION";
        }
        else if (this.transactionInProgress) {
            this.transMgr.processCommand(inputCmd);
            if (inputCmd.command === db_1.DB_COMMAND.COMMIT) {
                this.transactionInProgress = false;
            }
        }
        else if (!this.transactionInProgress &&
            inputCmd.command === db_1.DB_COMMAND.BEGIN) {
            this.transactionInProgress = true;
            this.transMgr.processCommand(inputCmd);
        }
        else {
            var db = Database.getInstance();
            switch (inputCmd.command) {
                case "SET":
                    db.set(inputCmd);
                    break;
                case 'GET':
                    return db.get(inputCmd);
                case 'UNSET':
                    db.unset(inputCmd);
                    break;
                case 'NUMEQUALTO':
                    return db.numEqualTo(inputCmd) + '';
                default:
                    return 'Invalid Command!';
                    break;
            }
        }
    };
    return CommandProcessor;
}());
exports.CommandProcessor = CommandProcessor;
var TransactionMgr = /** @class */ (function () {
    function TransactionMgr() {
        this.commands = new Array();
    }
    TransactionMgr.prototype.processCommand = function (cmd) {
        if (cmd.command === db_1.DB_COMMAND.ROLLBACK) {
            var idx = this.commands.length - 1;
            var mostRecentBeginExists = true;
            while (mostRecentBeginExists) {
                if (this.commands[idx].command === db_1.DB_COMMAND.BEGIN) {
                    mostRecentBeginExists = false;
                }
                this.commands.pop();
            }
            return;
        }
        else if (cmd.command === db_1.DB_COMMAND.COMMIT) {
            Database.getInstance().commit(this.commands);
            this.commands = [];
        }
        else {
            this.commands.push(cmd);
        }
    };
    return TransactionMgr;
}());
