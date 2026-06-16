import { Component, Input } from "@angular/core"
import {GeekSummary} from "extstats-api";

@Component({
  selector: 'updates-panel',
  templateUrl: './updates-panel.component.html',
  styleUrls: ['./updates-panel.component.css'],
  standalone: true
})
export class UpdatesPanelComponent {
  @Input('geekData') data: GeekSummary | undefined;

  constructor() { }
}


