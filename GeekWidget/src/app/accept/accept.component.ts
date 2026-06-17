import {Component, effect, input, model} from '@angular/core';
import {NgClass} from "@angular/common";
import {TradeItem, TradeModel} from "../geeklist-util/trade-model";

@Component({
  selector: 'trade-accept',
  templateUrl: './accept.component.html',
  styleUrl: './accept.component.css',
  imports: [
    NgClass
  ],
  standalone: true
})
export class AcceptComponent {
  mine = input.required<TradeItem>();
  want = input.required<TradeItem>();
  model = input.required<TradeModel>();
  accept = model<boolean>(false);

  constructor() {
    effect(() => {
      this.model().setAccept(this.mine(), this.want(), this.accept());
    });
  }

  onClick() {
    this.accept.update(a => !a);
  }
}
