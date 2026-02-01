import {Component} from '@angular/core';
import {ExtstatsApi} from "extstats-api";
import {UserConfigService} from "extstats-angular";
import {MostPlayedUnplayedComponent} from "./most-played/most-played-unplayed.component";

@Component({
  selector: 'discover-widget',
  imports: [
    MostPlayedUnplayedComponent
  ],
  templateUrl: './app.component.html'
})
export class DiscoverWidget {
  constructor(private api: ExtstatsApi, private userService: UserConfigService) {
  }
}
