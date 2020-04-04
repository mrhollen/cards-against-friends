"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var uuid_1 = require("uuid");
var User = /** @class */ (function () {
    function User(name, socket, isConnected) {
        if (isConnected === void 0) { isConnected = false; }
        this.uuid = uuid_1.v4();
        this.name = name;
        this.socket = socket;
        this.isConnected = isConnected;
        this.cardsInHand = [];
        this.promptCardsWon = [];
    }
    return User;
}());
exports.User = User;
