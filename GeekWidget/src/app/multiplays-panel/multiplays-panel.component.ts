import { Component, Input } from '@angular/core';
import {GeekSummary} from "extstats-api";

@Component({
  selector: 'multiplays-panel',
  templateUrl: './multiplays-panel.component.html',
  styleUrls: ['./multiplays-panel.component.css'],
  standalone: true
})
export class MultiplaysPanelComponent {
  @Input('geekData') data: GeekSummary | undefined;

  constructor() { }
}
