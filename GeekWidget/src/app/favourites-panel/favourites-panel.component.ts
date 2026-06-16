import { Component, OnInit, Input } from '@angular/core';
import {GeekSummary} from "extstats-api";

@Component({
  selector: 'favourites-panel',
  templateUrl: './favourites-panel.component.html',
  styleUrls: ['./favourites-panel.component.css'],
  standalone: true
})
export class FavouritesPanelComponent implements OnInit {
  @Input('geekData') data: GeekSummary | undefined;

  public constructor() { }

  public ngOnInit() {
  }
}
