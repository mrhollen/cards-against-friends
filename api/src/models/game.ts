import { v4 as uuidv4 } from 'uuid';
import { Users } from './users';
import { User } from './user';

export class Game {
    private characters = "abcdefghijklmnopqrstuvwxyz";

    readonly joinCode: string;
    readonly uuid: string;
    readonly password: string | null;
    readonly usersInGame: Users;

    constructor(password: string | null = null) {
        this.password = password;

        this.joinCode = this.generateJoinCode();
        this.uuid = uuidv4();

        this.usersInGame = new Users();
    }

    joinGame(user: User, password: string | null = null): boolean {
        if (password === this.password) {
            this.usersInGame.addUser(user);
        } else {
            return false;
        }

        return true;
    }

    rejoinGame(user: User, password: string | null = null): boolean {
        if (this.userIsPlaying(user) && password === this.password) {
            this.usersInGame.allUsers.forEach(u => {
                if (u.uuid === user.uuid) {
                    console.log(`${u.uuid} has rejoined ${this.joinCode}`);
                    u.isConnected = true;
                }
            });
        } else {
            return false;
        }

        return true;
    }

    leaveGame(user: User): boolean {
        this.usersInGame.disconnectUser(user);
        
        return true;
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