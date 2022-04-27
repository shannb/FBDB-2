"use strict";
exports.__esModule = true;
exports.Database = void 0;
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
