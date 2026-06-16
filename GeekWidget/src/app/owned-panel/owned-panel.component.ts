import { Component, Input } from '@angular/core';
import {GeekSummary} from "extstats-api";

@Component({
  selector: 'owned-panel',
  templateUrl: './owned-panel.component.html',
  styleUrls: ['./owned-panel.component.css'],
  standalone: true
})
export class OwnedPanelComponent {
  @Input('geekData') data: GeekSummary | undefined;
}
