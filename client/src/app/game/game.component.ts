import { Component, OnInit } from '@angular/core';
import { IGame } from '../../../../common/interfaces/game';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.less']
})
export class GameComponent implements OnInit {
  game: IGame;

  gameEnded = false;

  constructor(
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.eventService.$currentGame.subscribe(game => {
      if (game) {
        this.game = game;
        console.log(game);
      } else {
        this.gameEnded = true;
      }
    });
  }

}
