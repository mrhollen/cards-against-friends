"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var users_1 = require("./users");
var Game = /** @class */ (function () {
    function Game(password) {
        if (password === void 0) { password = null; }
        this.password = password;
        this.characters = "abcdefghijklmnopqrstuvwxyz";
        this.password = password;
        this.joinCode = this.generateJoinCode();
        this.uuid = uuid_1.v4();
        this.usersInGame = new users_1.Users();
    }
    Game.prototype.joinGame = function (user, password) {
        if (password === void 0) { password = null; }
        if (password === this.password) {
            this.usersInGame.addUser(user);
        }
        return this.usersInGame.connectedUsers;
    };
    Game.prototype.leaveGame = function (user) {
        this.usersInGame.disconnectUser(user);
        return this.usersInGame.connectedUsers;
    };
    Game.prototype.userIsPlaying = function (user) {
        return this.usersInGame.contains(user);
    };
    Game.prototype.generateJoinCode = function (length) {
        if (length === void 0) { length = 4; }
        var code = '';
        for (var i = 0; i < length; i++) {
            code += this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        }
        return code;
    };
    return Game;
}());
exports.Game = Game;
