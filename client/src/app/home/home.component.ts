import { Component, OnInit } from '@angular/core';
import { EventService } from '../services/event.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {
  readonly maxNameLength = 20;

  joinCodeControl: FormControl;
  joinNameControl: FormControl;
  joinPasswordControl: FormControl;

  startNameControl: FormControl;
  startPasswordControl: FormControl;

  joinForm: FormGroup;
  startForm: FormGroup;

  constructor(
    private eventService: EventService,
    private router: Router
    ) { }

  ngOnInit() {
    this.joinCodeControl = new FormControl('', [Validators.required, Validators.maxLength(4), Validators.minLength(4)]);
    this.joinNameControl = new FormControl('', [Validators.required, Validators.maxLength(this.maxNameLength)]);
    this.joinPasswordControl = new FormControl('');

    this.startNameControl = new FormControl('', [Validators.required, Validators.maxLength(this.maxNameLength)]);
    this.startPasswordControl = new FormControl('');

    this.joinForm = new FormGroup({
      joinCodeControl: this.joinCodeControl,
      joinNameControl: this.joinNameControl,
      joinPasswordControl: this.joinPasswordControl
    });

    this.startForm = new FormGroup({
      startNameControl: this.startNameControl,
      startPasswordControl: this.startPasswordControl
    });

    this.joinCodeControl.valueChanges.subscribe((value: string) => {
      this.joinCodeControl.setValue(value.toUpperCase(), {emitEvent: false});
    });

    this.eventService.$currentGame.subscribe(game => {
      if (game) {
        this.router.navigate([`/game`]);
      }
    });
  }

  startGame() {
    if (this.startForm.valid) {
      this.eventService.startNewGame(
        this.startNameControl.value,
        this.startPasswordControl.value
      );
    }
  }

  joinGame() {
    if (this.joinForm.valid) {
      this.eventService.joinGame(
        this.joinNameControl.value,
        this.joinCodeControl.value.toLowerCase(),
        this.joinPasswordControl.value
      );
    }
  }

}
