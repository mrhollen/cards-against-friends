import { Game } from "./models/game";
import { User } from "./models/user";
import { Socket } from 'socket.io';
import { GameMapper } from '../src/mappers/game-mapper';
import { INewGameRequest } from "../../common/interfaces/new-game-request";
import { IJoinGameRequest } from '../../common/interfaces/join-game-request';
import { IRejoinRequest } from '../../common/interfaces/rejoin-request';
import { IGame } from '../../common/interfaces/game';
import { IUser } from "../../common/interfaces/user";
import { IEndGameRequest } from '../../common/interfaces/end-game-request';

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
            let user = new User("", socket, true);
            
            this.users.set(user.uuid, user);
            socket.emit("connected", user.uuid);

            console.log(`User Connected: ${user.uuid}`);

            socket.on("reconnect-user", (uuid: string) => {
                const oldUuid = user.uuid;

                if (this.users.has(uuid)) {
                    user = this.users.get(uuid) as User;
                }

                user.uuid = uuid;
                user.isConnected = true;
                user.socket = socket;

                console.log(`${oldUuid} is now ${user.uuid}`);

                this.activeGames.forEach(game => {
                    if (game.userIsPlaying(user)) {
                        socket.emit("joined-game", GameMapper.fromGameToResponse(game));
                    }
                });
            });

            socket.on("new", (request: INewGameRequest) => {
                user.name = request.name;

                const game = this.createNewGame(request.password, user);

                socket.emit("joined-game", GameMapper.fromGameToResponse(game));
            });

            socket.on("join", (request: IJoinGameRequest) => {
                user.name = request.name;

                const game = this.joinGame(request.joinCode, request.password, user);

                if (game) {
                    socket.emit("joined-game", GameMapper.fromGameToResponse(game));
                }
            });

            socket.on("rejoin", (request: IRejoinRequest) => {
                const game = this.rejoinGame(request.joinCode, request.password, user);

                if (game) {
                    socket.emit("joined-game", GameMapper.fromGameToResponse(game));
                }
            });

            socket.on("end", (request: IEndGameRequest) => {
                this.endGame(request.joinCode, request.uuid);
            });

            socket.on("exit", () => {
                this.leaveGame(user);
            });

            socket.on("disconnect", () => {
                user.isConnected = false;
                // this.pruneInactiveGames();
            });
        });
    }

    sendGameState(game: Game) {
        const fullUsers: Array<User> = game.usersInGame.connectedUsers;

        for (const user of fullUsers) {
            if (user.socket.connected) {
                user.socket.emit("game-state", GameMapper.fromGameToResponse(game));
            }
        }
    }

    createNewGame(password: string | null = null, user: User): Game {
        const game = new Game(password);
        
        game.joinGame(user, password);

        this.activeGames.set(game.joinCode, game);

        return game;
    }

    endGame(joinCode: string, uuid: string) {
        const game = this.activeGames.get(joinCode);
        
        if (game && game.uuid === uuid) {
            console.log('Ending game ' + game.joinCode);

            game.usersInGame.connectedUsers.forEach(user => {
                user.socket.emit("end-game");
            });

            this.activeGames.delete(game.joinCode);
        }
    }

    joinGame(joinCode: string, password: string, user: User): Game | undefined {
        const game = this.activeGames.get(joinCode);

        if (game?.userIsPlaying(user)) {
            return this.rejoinGame(joinCode, password, user);
        }

        if (game) {
            if (game.joinGame(user, password)) {
                this.sendGameState(game);
            }
        }
        
        return game;
    }

    rejoinGame(joinCode: string, password: string, user: User): Game | undefined {
        const game = this.activeGames.get(joinCode);

        if (game) {
            if (game.rejoinGame(user, password)) {
                this.sendGameState(game);
            }
        }
        
        return game;
    }

    leaveGame(user: User) {
        this.activeGames.forEach(game => {
            if (game.userIsPlaying(user)) {
                game.leaveGame(user);

                if (game.usersInGame.count < 1) {
                    this.endGame(game.joinCode, game.uuid);
                } else {
                    this.sendGameState(game);
                }
            }
        });
    }

    pruneInactiveGames() {
        const gamesToRemove: Array<Game> = Array();

        this.activeGames.forEach((game: Game) => {
            if (game.usersInGame.connectedUsers.length < 1) {
                gamesToRemove.push(game);
            }
        });

        gamesToRemove.forEach(game => this.endGame(game.joinCode, game.uuid));
    }
}