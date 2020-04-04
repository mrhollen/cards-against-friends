import { v4 as uuidv4 } from 'uuid';
import { Users } from './users';
import { User } from './user';

export class Game {
    private characters = "abcdefghijklmnopqrstuvwxyz";

    readonly joinCode: string;
    readonly uuid: string;
    readonly usersInGame: Users;

    constructor(private password: string | null = null) {
        this.password = password;

        this.joinCode = this.generateJoinCode();
        this.uuid = uuidv4();

        this.usersInGame = new Users();
    }

    joinGame(user: User, password: string | null = null): Array<User> {
        if (password === this.password) {
            this.usersInGame.addUser(user);
        }

        return this.usersInGame.connectedUsers;
    }

    leaveGame(user: User): Array<User> {
        this.usersInGame.disconnectUser(user);
        
        return this.usersInGame.connectedUsers;
    }

    userIsPlaying(user: User): boolean {
        return this.usersInGame.contains(user);
    }

    private generateJoinCode(length: number = 4): string {
        let code = '';
        for ( var i = 0; i < length; i++ ) {
            code += this.characters.charAt(Math.floor(Math.random() * this.characters.length));
        }

        return code;
    }
}