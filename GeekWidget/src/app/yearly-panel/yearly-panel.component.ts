import { Component, OnInit, Input } from '@angular/core';
import { GeekSummary } from "extstats-core";

@Component({
  selector: 'yearly-panel',
  templateUrl: './yearly-panel.component.html',
  styleUrls: ['./yearly-panel.component.css'],
  standalone: true
})
export class YearlyPanelComponent {
  @Input('geekData') geek: GeekSummary | undefined;
}

