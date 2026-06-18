import {Component, effect, model, output} from '@angular/core';
import {TradeItem} from "../geeklist-util/trade-model";
import {FormsModule} from "@angular/forms";

export interface MoveEvent {
  original: number;
  destination: number;
}

@Component({
  selector: 'trade-item',
  templateUrl: './trade-item.component.html',
  styleUrl: './trade-item.component.css',
  imports: [
    FormsModule
  ],
  standalone: true
})
export class TradeItemComponent {
  item = model.required<TradeItem>();
  mine = model.required<boolean>();
  position = model.required<number>();
  newPos = model<number | undefined>();
  max = model.required<number>();
  move = output<MoveEvent>();

  constructor() {
    effect(() => {
      this.newPos.update(x => this.position());
    });
    effect(() => {
      // combo box can give us a string
      let np: any = this.newPos();
      if (!np) return;
      if (typeof np === typeof "") np = parseInt(np as string);
      if (np !== this.position()) {
        this.move.emit({ original: this.position(), destination: np });
      }
    });
  }

  protected readonly Array = Array;
}
