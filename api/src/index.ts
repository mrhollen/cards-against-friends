import * as http from 'http';
import * as io from 'socket.io';
import { Game } from './models/game';
import { Socket, ServerOptions } from 'socket.io';
import { SocketServer } from './socket-server';

const ioServerOptions: ServerOptions = {
    serveClient: true,
    pingInterval: 10000,
    pingTimeout: 5000
};

const httpServer = http.createServer();
const ioServer = io(httpServer, ioServerOptions);
const socketServer = new SocketServer(ioServer);

httpServer.listen(8080, () => console.log("listening on *:8080"));