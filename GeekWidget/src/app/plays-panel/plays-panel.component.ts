import { Component, Input } from '@angular/core';
import {GeekSummary} from "extstats-api";

@Component({
  selector: 'plays-panel',
  templateUrl: './plays-panel.component.html',
  styleUrls: ['./plays-panel.component.css'],
  standalone: true
})
export class PlaysPanelComponent {
  @Input('geekData') data: GeekSummary | undefined;

  constructor() { }
}
