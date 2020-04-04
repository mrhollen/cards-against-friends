import { User } from './user';
export declare class Users {
    private allUsers;
    get connectedUsers(): any[];
    get count(): number;
    contains(user: User): boolean;
    addUser(user: User): boolean;
    disconnectUser(user: User): void;
}
