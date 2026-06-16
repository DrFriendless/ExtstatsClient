import { Component, Input } from '@angular/core';
import {GeekSummary} from "extstats-api";

@Component({
  selector: 'yearly-panel',
  templateUrl: './yearly-panel.component.html',
  styleUrls: ['./yearly-panel.component.css'],
  standalone: true
})
export class YearlyPanelComponent {
  @Input('geekData') geek: GeekSummary | undefined;
}

