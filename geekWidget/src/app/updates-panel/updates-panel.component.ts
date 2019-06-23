import { Component, Input } from "@angular/core"
import { GeekSummary } from "extstats-core";

@Component({
  selector: 'updates-panel',
  templateUrl: './updates-panel.component.html',
  styleUrls: ['./updates-panel.component.css']
})
export class UpdatesPanelComponent {
  @Input('geekData') data: GeekSummary;

  constructor() { }
}


