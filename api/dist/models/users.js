"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Users = /** @class */ (function () {
    function Users() {
        this.allUsers = new Set();
    }
    Object.defineProperty(Users.prototype, "connectedUsers", {
        get: function () {
            var results = Array();
            this.allUsers.forEach(function (user) {
                if (user.isConnected) {
                    results.push(user);
                }
            });
            return results;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Users.prototype, "count", {
        get: function () {
            return this.allUsers.size;
        },
        enumerable: true,
        configurable: true
    });
    Users.prototype.contains = function (user) {
        return this.connectedUsers.some(function (connectedUser) { return user.uuid === connectedUser.uuid; });
    };
    Users.prototype.addUser = function (user) {
        try {
            this.allUsers.add(user);
            return true;
        }
        catch (_a) {
            return false;
        }
    };
    Users.prototype.disconnectUser = function (user) {
        this.allUsers.forEach(function (iteration) {
            if (iteration.uuid === user.uuid) {
                iteration.isConnected = false;
            }
        });
    };
    return Users;
}());
exports.Users = Users;
