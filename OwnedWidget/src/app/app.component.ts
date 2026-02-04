import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {
  GraphQuerySourceComponent,
  LoaderComponent,
  SelectorComboComponent,
  UserConfigService,
} from "extstats-angular";
import {ExtstatsApi} from "extstats-api";
import {map} from "rxjs";
import {
  PlaysOfGamesOwnedByPublishedYearComponent
} from "./plays-of-games-owned-by-published-year/plays-of-games-owned-by-published-year.component";
import {RatingsOfOwnedGamesComponent} from "./ratings-of-owned-games/ratings-of-owned-games.component";
import {BggRatingsOfOwnedGamesComponent} from "./bgg-ratings-of-owned-games/bgg-ratings-of-owned-games.component";
import {LeastLovedComponent} from "./least-loved/least-loved.component";
import {RatingByLifetimeComponent} from "./rating-by-lifetime/rating-by-lifetime.component";
import {OwnedByPublishedYearComponent} from "./owned-by-published-year/owned-by-published-year.component";
import {PogoTableComponent} from "./pogo-table/pogo-table.component";
import {PlaysOfGamesOwnedComponent} from "./plays-of-games-owned/plays-of-games-owned.component";
import {MostUnusualComponent} from "./most-unusual/most-unusual.component";

export interface GeekGameResult {
  bggid: number;
  shouldPlayScore: number;
  daysSincePlayed: number;
  rating: number;
  years: number;
  months: number;
  expansion: boolean;
  plays: number;
  lastPlay: number;
  firstPlay: number;
  forTrade: boolean;
  lyPlays: number;
}
export interface GameResult {
  bggid: number;
  name: string;
  playTime: number;
  bggRanking: number;
  bggRating: number;
  yearPublished: number;
  isExpansion: boolean;
}
export interface Data {
  geekGames: GeekGameResult[];
  games: GameResult[];
}
interface Result {
  geekgames: Data;
}

@Component({
  selector: 'owned-collection',
  imports: [
    PlaysOfGamesOwnedByPublishedYearComponent,
    RatingsOfOwnedGamesComponent,
    BggRatingsOfOwnedGamesComponent,
    LeastLovedComponent,
    RatingByLifetimeComponent,
    OwnedByPublishedYearComponent,
    PogoTableComponent,
    PlaysOfGamesOwnedComponent,
    LoaderComponent,
    SelectorComboComponent,
    MostUnusualComponent
  ],
  templateUrl: './app.component.html'
})
export class UserOwnedComponent extends GraphQuerySourceComponent<Result> implements AfterViewInit {
  private static DEFAULT_SELECTOR = "owned(ME)";
  private selector = UserOwnedComponent.DEFAULT_SELECTOR;
  public pageData$ = this.data$.pipe(map(d => d.geekgames));
  @ViewChild(SelectorComboComponent) selectorCombo: SelectorComboComponent | undefined;

  constructor(api: ExtstatsApi, private userService: UserConfigService) {
    super(api);
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.selectorCombo) {
      this.selectorCombo.setDefault(UserOwnedComponent.DEFAULT_SELECTOR);
      this.selectorCombo.setSelected(UserOwnedComponent.DEFAULT_SELECTOR);
    }
  }

  protected buildQuery(): string {
    return `{geekgames(selector: "${this.selector}", vars: [{name: "ME", value: "${this.userService.getAGeek()}"}]) {` +
      " games { bggid name playTime bggRanking bggRating yearPublished isExpansion } " +
      " geekGames { bggid rating shouldPlayScore years months expansion plays lastPlay firstPlay lyPlays daysSincePlayed forTrade } " +
      "}}";
  }

  onSelectorChosen(event: string) {
    this.selector = event;
    super.refresh();
  }
}

export function ymdToDate(ymd: number): Date {
  const y = Math.floor(ymd / 10000);
  const d = ymd % 100;
  const m = Math.floor(ymd / 100) % 100;
  return new Date(y, m - 1, d);
}

export function formatDate(date: number | undefined): string {
  function pad(n: number): string {
    return ((n < 10) ? "0" : "") + n;
  }
  if (!date) return "";
  const y = Math.floor(date / 10000);
  const m = Math.floor(date / 100) % 100;
  const d = date % 100;
  return `${y}-${pad(m)}-${pad(d)}`;
}
