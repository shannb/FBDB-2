"use strict";
exports.__esModule = true;
exports.CommandProcessor = exports.Database = void 0;
var db_1 = require("./db");
var Database = /** @class */ (function () {
    function Database() {
        this.dataStore = new Map();
        this.valueStore = new Map();
    }
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
    return Database;
}());
exports.Database = Database;
var CommandProcessor = /** @class */ (function () {
    function CommandProcessor() {
        this.command = "";
        this.transMgr = new TransactionMgr();
        this.db = new Database();
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
        this.transactionInProgress = inputCmd.command === db_1.DB_COMMAND.BEGIN;
        if (this.transactionInProgress) {
            this.transMgr.processCommand(inputCmd);
            if (inputCmd.command === db_1.DB_COMMAND.COMMIT) {
                this.transactionInProgress = false;
            }
        }
        else {
            switch (inputCmd.command) {
                case "SET":
                    this.db.set(inputCmd);
                    break;
                case 'GET':
                    return this.db.get(inputCmd);
                case 'UNSET':
                    this.db.unset(inputCmd);
                    break;
                case 'NUMEQUALTO':
                    return this.db.numEqualTo(inputCmd) + '';
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
        this.commands.push(cmd);
    };
    return TransactionMgr;
}());
