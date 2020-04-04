import { Users } from './users';
import { User } from './user';
export declare class Game {
    private password;
    private characters;
    readonly joinCode: string;
    readonly uuid: string;
    readonly usersInGame: Users;
    constructor(password?: string | null);
    joinGame(user: User, password?: string | null): Array<User>;
    leaveGame(user: User): Array<User>;
    userIsPlaying(user: User): boolean;
    private generateJoinCode;
}
