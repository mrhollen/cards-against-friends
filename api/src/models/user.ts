import { Socket } from "socket.io";
import { Card } from "./card";
import { v4 as uuidv4 } from "uuid";

export class User {
    uuid: string;
    name: string;
    socket: Socket;
    isConnected: boolean;
    cardsInHand: Array<Card>;
    promptCardsWon: Array<Card>;

    constructor(name: string, socket: Socket, isConnected: boolean = false) {
        this.uuid = uuidv4();
        this.name = name;
        this.socket = socket;
        this.isConnected = isConnected;
        this.cardsInHand = [];
        this.promptCardsWon = [];
    }
}