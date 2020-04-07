import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { IGame } from '../../../../common/interfaces/game';

@Component({
  selector: 'app-top-nav',
  templateUrl: './top-nav.component.html',
  styleUrls: ['./top-nav.component.less']
})
export class TopNavComponent implements OnInit {

  showDisconnected = false;
  showConnected = false;

  game: IGame = null;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.eventService.$connected.subscribe((online: boolean) => {
      if (online) {
        this.showConnected = true;
        this.showDisconnected = false;
        setTimeout(() => this.showConnected = false, 1000);
      } else {
        this.showConnected = false;
        this.showDisconnected = true;
      }
    });

    this.eventService.$currentGame.subscribe(game => {
      this.game = game;
    });
  }

  exitCurrentGame() {
    this.eventService.exitGame();
  }

}
