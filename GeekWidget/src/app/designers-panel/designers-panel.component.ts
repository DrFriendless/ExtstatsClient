import { Component, Input } from "@angular/core"
import {GeekSummary} from "extstats-api";

@Component({
  selector: 'designers-panel',
  templateUrl: './designers-panel.component.html',
  styleUrls: ['./designers-panel.component.css'],
  standalone: true
})
export class DesignersPanelComponent {
  @Input('geekData') data: GeekSummary | undefined;

  constructor() { }
}


