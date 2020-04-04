import { Socket } from "socket.io";
import { Card } from "./card";
export declare class User {
    uuid: string;
    name: string;
    socket: Socket;
    isConnected: boolean;
    cardsInHand: Array<Card>;
    promptCardsWon: Array<Card>;
    constructor(name: string, socket: Socket, isConnected?: boolean);
}
