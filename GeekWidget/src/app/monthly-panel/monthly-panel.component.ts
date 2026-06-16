import { Component, Input } from '@angular/core';
import {GeekSummary} from "extstats-api";

@Component({
  selector: 'monthly-panel',
  templateUrl: './monthly-panel.component.html',
  styleUrls: ['./monthly-panel.component.css'],
  standalone: true
})
export class MonthlyPanelComponent {
  @Input('geekData') data: GeekSummary | undefined;
}

