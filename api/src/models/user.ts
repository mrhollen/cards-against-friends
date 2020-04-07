import { Socket } from "socket.io";
import { Card } from "./card";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "../../../common/interfaces/user";

export class User implements IUser {
    uuid: string;
    name: string;
    socket: Socket;
    isConnected: boolean;
    cardsInHand: Array<Card>;
    promptCardsWon: Array<Card>;

    get numberPromptCardsWon() {
        return this.promptCardsWon.length;
    }

    constructor(name: string, socket: Socket, isConnected: boolean = false) {
        this.uuid = uuidv4();
        this.name = name;
        this.socket = socket;
        this.isConnected = isConnected;
        this.cardsInHand = [];
        this.promptCardsWon = [];
    }
}