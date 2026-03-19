import {Component, Input} from "@angular/core";

@Component({
  selector: 'designer',
  imports: [
  ],
  templateUrl: './board-game-designer-link.component.html'
})
export class BoardGameDesignerLinkComponent {
  @Input('designer') designer: { name: string, bggid: number } | undefined;
}
