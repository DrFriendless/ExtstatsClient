import {Component, Input} from "@angular/core";

@Component({
  selector: 'boardgame',
  imports: [
  ],
  templateUrl: './board-game-link.component.html'
})
export class BoardGameLinkComponent  {
  @Input('game') game: { name: string, bggid: number } | undefined;
}
