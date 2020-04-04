"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http = require("http");
var io = require("socket.io");
var game_1 = require("./models/game");
var user_1 = require("./models/user");
var ioServerOptions = {
    serveClient: true,
    pingInterval: 10000,
    pingTimeout: 5000
};
var httpServer = http.createServer();
var ioServer = io(httpServer, ioServerOptions);
var activeGames = new Map();
var users = new Map();
ioServer.on("connection", function (socket) {
    var user = new user_1.User("", socket, true);
    users.set(user.uuid, user);
    socket.emit("connected", user.uuid);
    socket.on("host", function (request) {
        var game = createNewGame(request.password);
        socket.emit("created", game);
    });
    socket.on("join", function (request) {
        user.name = request.name;
        joinGame(request.joinCode, request.password, user);
    });
    socket.on("rejoin", function (request) {
        user.uuid = request.uuid;
        user.uuid = request.name;
        joinGame(request.joinCode, request.password, user);
    });
    socket.on("end", function (uuid) {
        endGame(uuid);
    });
    socket.on("disconnect", function () {
        leaveGame(user);
    });
});
function alertUserListChange(users) {
    for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
        var user = users_1[_i];
        if (user.socket.connected) {
            user.socket.emit("user-list-changed", users);
        }
    }
}
function createNewGame(password) {
    if (password === void 0) { password = null; }
    var game = new game_1.Game(password);
    activeGames.set(game.joinCode, game);
    return game;
}
function endGame(uuid) {
    var game = activeGames.get(uuid);
    if (game) {
        game.usersInGame.connectedUsers.forEach(function (user) {
            user.socket.emit("end");
        });
        activeGames.delete(game.joinCode);
    }
}
function joinGame(joinCode, password, user) {
    var game = activeGames.get(joinCode);
    if (game) {
        alertUserListChange(game.joinGame(user, password));
        return true;
    }
    else {
        return false;
    }
}
function leaveGame(user) {
    activeGames.forEach(function (game) {
        if (game.userIsPlaying(user)) {
            game.leaveGame(user);
        }
    });
}
httpServer.listen(8080, function () {
    console.log("listening on *:8080");
});
