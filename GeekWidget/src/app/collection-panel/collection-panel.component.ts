import { Component, Input } from '@angular/core';
import { GeekSummary } from "extstats-core";
import { Observer } from "rxjs";
import {DecimalPipe} from "@angular/common";

@Component({
  selector: 'collection-panel',
  templateUrl: './collection-panel.component.html',
  styleUrls: ['./collection-panel.component.css'],
  imports: [
    DecimalPipe
  ],
  standalone: true
})
export class CollectionPanelComponent {
  @Input('geekData') data: GeekSummary | undefined;
}

