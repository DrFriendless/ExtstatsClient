import { Component, OnInit } from '@angular/core';
import {GraphQuerySourceComponent, LoaderComponent, UserConfigService} from "extstats-angular";
import {YMD} from "./library";
import {LoginService} from "./login.service";
import {ExtstatsApi, GeekSummary} from "extstats-api";
import {RatingOfPlayedComponent} from "./rating-of-played/rating-of-played.component";
import {BestDaysComponent} from "./best-days/best-days.component";
import {FlorenceNightingaleComponent} from "./florence-nightingale/florence-nightingale.component";
import {NewPlaysComponent} from "./new-plays/new-plays.component";
import {MostPlayedByYearComponent} from "./most-played-by-year/most-played-by-year.component";
import {TemporalByDateComponent} from "./temporal-by-date/temporal-by-date.component";
import {TemporalByMonthComponent} from "./temporal-by-month/temporal-by-month.component";
import {TemporalByDayComponent} from "./temporal-by-day/temporal-by-day.component";
import {PlaysByYearTableComponent} from "./plays-by-year/plays-by-year.component";
import {HIndexComponent} from "./h-index/h-index.component";

// these types are the shape of the data returned by the GraphQL query.
export interface GameData {
  bggid: number;
  name: string;
  subdomain: string;
}
export interface PlayData extends YMD {
  bggid: number;
  quantity: number;
  name?: string;
}
export interface GeekGameData {
  bggid: number;
  rating: number;
}
export interface PlaysData {
  games: GameData[];
  plays: PlayData[];
  geekgames: GeekGameData[];
}
export interface Result {
  plays: PlaysData;
}

@Component({
  selector: 'plays-widget',
  templateUrl: './app.component.html',
  imports: [
    LoaderComponent,
    RatingOfPlayedComponent,
    BestDaysComponent,
    FlorenceNightingaleComponent,
    NewPlaysComponent,
    MostPlayedByYearComponent,
    TemporalByDateComponent,
    TemporalByMonthComponent,
    TemporalByDayComponent,
    MostPlayedByYearComponent,
    MostPlayedByYearComponent,
    MostPlayedByYearComponent,
    PlaysByYearTableComponent,
    HIndexComponent
  ]
})
export class PlaysWidget extends GraphQuerySourceComponent<Result> implements OnInit {
  geekData: GeekSummary | undefined;

  constructor(api: ExtstatsApi, private userService: UserConfigService, private loginService: LoginService) {
    super(api);

  }

  async ngOnInit() {
    console.log("features", this.loginService.features);
    this.loginService.isLoggedIn.subscribe(yes => {
      console.log("logged in = ", yes);
      if (yes) {
        this.loadSettings();
      } else {
        this.clearSettings();
      }
    })
    this.refresh();
    this.geek = this.userService.getAGeek();
    if (this.geek) {
      this.loading = true;
      this.geekData = await this.api.getGeekSummary(this.geek);
      this.loading = false;
    }
  }

  private loadSettings(): void {
  }

  private clearSettings(): void {
  }

  protected buildQuery(): string {
    return `{plays(geeks: ["${this.userService.getAGeek()}"]) { games { bggid name subdomain } plays { bggid year month day quantity } geekgames { bggid rating } } }`;
  }
}
