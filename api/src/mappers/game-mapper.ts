import { Game } from '../models/game';
import { IGame } from '../../../common/interfaces/game';
import { IUser } from '../../../common/interfaces/user';
import { User } from '../models/user';

export class GameMapper {
    static fromGameToResponse(game: Game): IGame {
        return {
            uuid: game.uuid,
            joinCode: game.joinCode,
            password: game.password,
            usersInGame: (() => {
                const array: Array<IUser> = Array();
                game.usersInGame.connectedUsers.forEach((fu: User) => {
                    array.push({
                        name: fu.name,
                        numberPromptCardsWon: fu.numberPromptCardsWon
                    });
                });
                return array;
            })()
        };
    }
}