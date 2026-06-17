import {Component, model} from '@angular/core';
import {TradeItem} from "../geeklist-util/trade-model";

@Component({
  selector: 'trade-item',
  templateUrl: './trade-item.component.html',
  styleUrl: './trade-item.component.css',
  imports: [
  ],
  standalone: true
})
export class TradeItemComponent {
  item = model.required<TradeItem>();
  mine = model.required<boolean>();
}
