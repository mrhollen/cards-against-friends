import { Injectable, OnInit } from '@angular/core';
import * as socketio from 'socket.io-client';
import { BehaviorSubject } from 'rxjs';
import { IGame } from '../../../../common/interfaces/game';
import { INewGameRequest } from '../../../../common/interfaces/new-game-request';
import { IJoinGameRequest } from '../../../../common/interfaces/join-game-request';
import { IUser } from '../../../../api/dist/common/interfaces/user';
import { IRejoinRequest } from '../../../../common/interfaces/rejoin-request';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private uuid: string;
  private socket;

  private gameInProgress: boolean;

  $connected: BehaviorSubject<boolean>;
  $currentGame: BehaviorSubject<IGame | null>;

  constructor() {
    this.$connected = new BehaviorSubject(false);
    this.$currentGame = new BehaviorSubject(null);

    this.socket = socketio('http://localhost:8080').connect();

    this.uuid = localStorage.getItem('userId');

    this.socket.on('connected', (uuid: string) => {
      if (!this.uuid) {
        localStorage.setItem('userId', uuid);
        this.uuid = uuid;
      } else {
        this.socket.emit('reconnect-user', this.uuid);
        this.tryRejoinGame();
      }

      this.$connected.next(true);
    });

    this.socket.on('disconnect', () => {
      this.$connected.next(false);
    });

    this.socket.on('joined-game', (response: IGame) => {
      localStorage.setItem('currentGame', JSON.stringify(response));

      this.gameInProgress = true;
      this.$currentGame.next(response);
    });

    this.socket.on('exit-game', () => {
      this.gameInProgress = false;
      this.exitGame();
    });

    this.socket.on('game-state', (game: IGame) => this.$currentGame.next(game));
  }

  startNewGame(name: string, password: string) {
    const request: INewGameRequest = {
      name,
      password
    };

    this.socket.emit('new', request);
  }

  joinGame(name: string, joinCode: string, password: string) {
    const request: IJoinGameRequest = {
      name,
      joinCode,
      password
    };

    this.socket.emit('join', request);
  }

  tryRejoinGame() {
    const jsonData = localStorage.getItem('currentGame');

    if (jsonData) {
      const game: IGame = JSON.parse(jsonData);
      const request: IRejoinRequest = {
        joinCode: game.joinCode,
        password: game.password
      };

      this.socket.emit('rejoin', request);
    }
  }

  exitGame() {
    if (this.gameInProgress) {
      this.socket.emit('exit');
    }

    this.gameInProgress = false;

    localStorage.removeItem('currentGame');
    this.$currentGame.next(null);
  }
}
