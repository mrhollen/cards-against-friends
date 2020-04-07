import { IUser } from './user';

export interface IJoinedGameResponse {
    joinCode: string;
    usersInGame: Array<IUser>;
}