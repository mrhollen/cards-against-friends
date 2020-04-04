import { Game } from "./models/game";
import { User } from "./models/user";
import { Socket } from 'socket.io';
import { NewGameRequest } from "../../common/interfaces/new-game-request";
import { NewGameResponse } from '../../common/interfaces/new-game-response';
import { JoinGameRequest } from '../../common/interfaces/join-game-request';
import { RejoinRequest } from '../../common/interfaces/rejoin-request';
import { UserResponse } from '../../common/interfaces/user-response';
import { UsersInGameResponse } from '../../common/interfaces/users-in-game-response';

export class SocketServer {
    private ioServer: SocketIO.Server;

    private activeGames: Map<string, Game> = new Map();
    private users: Map<string, User> = new Map();

    constructor(server: SocketIO.Server) {
        this.ioServer = server;
        this.setUpListeners();
    }

    setUpListeners() {
        this.ioServer.on("connection", (socket: Socket) => {
            const user = new User("", socket, true);
            
            this.users.set(user.uuid, user);
            socket.emit("connected", user.uuid);

            socket.on("host", (request: NewGameRequest) => {
                const game = this.createNewGame(request.password);

                const response: NewGameResponse = {
                    uuid: game.uuid,
                    joinCode: game.joinCode
                };

                socket.emit("created", response);
            });

            socket.on("join", (request: JoinGameRequest) => {
                user.name = request.name;
                this.joinGame(request.joinCode, request.password, user);
            });

            socket.on("rejoin", (request: RejoinRequest) => {
                user.uuid = request.uuid;
                user.uuid = request.name;

                this.joinGame(request.joinCode, request.password, user);
            });

            socket.on("end", (uuid: string) => {
                this.endGame(uuid);
            });

            socket.on("disconnect", () => {
                this.leaveGame(user);
            });
        });
    }

    alertUserListChange(users: Array<User>) {
        const userResponses: Array<UserResponse> = users.map(user => {
            return {
                name: user.name,
                promptCardsWon: user.promptCardsWon.length
            };
        });

        const response: UsersInGameResponse = { users: userResponses};

        for (const user of users) {
            if (user.socket.connected) {
                user.socket.emit("user-list-changed", response);
            }
        }
    }

    createNewGame(password: string | null = null): Game {
        const game = new Game(password);

        this.activeGames.set(game.joinCode, game);

        return game;
    }

    endGame(uuid: string) {
        const game = this.activeGames.get(uuid);
        
        if (game) {
            game.usersInGame.connectedUsers.forEach(user => {
                user.socket.emit("end");
            });

            this.activeGames.delete(game.joinCode);
        }
    }

    joinGame(joinCode: string, password: string, user: User): boolean {
        const game = this.activeGames.get(joinCode);

        if (game) {
            this.alertUserListChange(game.joinGame(user, password));
            return true;
        } else {
            return false;
        }
    }

    leaveGame(user: User) {
        this.activeGames.forEach(game => {
            if (game.userIsPlaying(user)) {
                game.leaveGame(user);
            }
        });
    }
}