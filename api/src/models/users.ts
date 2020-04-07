import { User } from './user';
export class Users {
    readonly allUsers: Set<User> = new Set();
    
    get connectedUsers() {
        const results = Array();

        this.allUsers.forEach(user => {
            if (user.isConnected) {
                results.push(user);
            }
        });

        return results;
    }

    get count() {
        return this.allUsers.size;
    }

    contains(user: User): boolean {
        this.allUsers.forEach(u => {
            if (u.uuid === user.uuid) {
                return true;
            }
        });

        return false;
    }

    addUser(user: User): boolean {
        try {
            this.allUsers.add(user);
            return true;
        } catch {
            return false;
        }
    }

    disconnectUser(user: User) {
        this.allUsers.forEach(iteration => {
            if (iteration.uuid === user.uuid) {
                iteration.isConnected = false;
            }
        });
    }
}