import { Component, Input } from '@angular/core';
import { GeekSummary } from "extstats-core";
import { Observer } from "rxjs";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'discover-panel',
  templateUrl: './discover-panel.component.html',
  styleUrls: ['./discover-panel.component.css'],
  imports: [
  ],
  standalone: true
})
export class DiscoverPanelComponent {
  @Input('geekData') data: GeekSummary | undefined;
}

