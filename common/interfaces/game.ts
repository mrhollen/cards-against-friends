import { IUser } from "./user";

export interface IGame {
    joinCode: string;
    uuid: string;
    password: string | null;
    usersInGame: Array<IUser>;
}