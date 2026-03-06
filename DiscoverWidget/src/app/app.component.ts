import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ExtstatsApi} from "extstats-api";
import {LoaderComponent, SelectorComboComponent, UserConfigService} from "extstats-angular";
import {MostPlayedUnplayedComponent} from "./most-played/most-played-unplayed.component";
import { Observable, Subject } from 'rxjs';
import { mergeMap, tap, share, map } from 'rxjs/operators';
import {BuyListComponent} from "./buy-list/buylist.component";
import {WanttoplayComponent} from "./want-to-play-list/wanttoplay.component";
import {WantintradeComponent} from "./want-in-trade-list/wantintrade.component";
import {ShameShelfComponent} from "./shame-self/shame-shelf.component";
import {RecommendationsComponent} from "./recommendations/recommendations.component";


export interface DataGame {
  bggid: number;
  name: string;
  bggRanking: number;
  weight: number;
  subdomain: string;
  yearPublished: number;
  minPlayers: number;
  maxPlayers: number;
}
export interface DataGeekGame {
  bggid: number;
  rating: number;
  wantInTrade: boolean;
  wantToPlay: boolean;
  wantToBuy: boolean;
}
export interface RawData {
  geekgames: {
    games: DataGame[];
    geekGames: DataGeekGame[];
  }
}
export interface Data {
  gamesIndex: Record<string, DataGame>;
  geekGames: DataGeekGame[];
}

@Component({
  selector: 'discover-widget',
  imports: [
    MostPlayedUnplayedComponent,
    LoaderComponent,
    SelectorComboComponent,
    BuyListComponent,
    WanttoplayComponent,
    WantintradeComponent,
    ShameShelfComponent,
    RecommendationsComponent
  ],
  templateUrl: './app.component.html'
})
export class DiscoverWidget implements AfterViewInit {
  private static DEFAULT_SELECTOR = "any(wit(ME),wtb(ME),wtp(ME))";
  private selector = DiscoverWidget.DEFAULT_SELECTOR;
  private queries = new Subject<any>();
  public data$: Observable<Data>;
  @ViewChild(SelectorComboComponent) selectorCombo: SelectorComboComponent | undefined;
  loading: boolean = false;

  constructor(private api: ExtstatsApi, private userService: UserConfigService) {
    this.data$ = this.queries.asObservable()
      .pipe(
        tap(() => this.loading = true),
        mergeMap(() => this
          .doQuery()
          .catch(err => {
            console.log(err);
            this.loading = false;
            return err;
          })),
        tap(() => this.loading = false),
        map(this.preprocess),
        share()
      );
  }

  private preprocess(d: RawData): Data {
    const gamesIndex: Record<string, DataGame> = {};
    for (const g of d.geekgames.games) {
      gamesIndex[g.bggid.toString()] = g;
    }
    return { gamesIndex, geekGames: d.geekgames.geekGames }
  }

  private async doQuery(): Promise<Data | undefined> {
    const q = this.buildQuery();
    if (q) {
      return await this.api.retrieve(q) as Data;
    } else {
      return undefined;
    }
  }

  ngAfterViewInit() {
    if (this.selectorCombo) {
      this.selectorCombo.setDefault(DiscoverWidget.DEFAULT_SELECTOR);
      this.selectorCombo.setSelected(DiscoverWidget.DEFAULT_SELECTOR);
    }
    this.refresh();
  }

  public refresh() {
    this.queries.next(null);
  }

  onSelectorChosen(event: string) {
    this.selector = event;
    this.refresh();
  }

  protected buildQuery(): string {
    return `{geekgames(selector: "${this.selector}", vars: [{name: "ME", value: "${this.userService.getAGeek()}"}]) {` +
      " games { bggid name bggRanking weight subdomain yearPublished minPlayers maxPlayers } " +
      " geekGames { bggid rating wantInTrade wantToPlay wantToBuy } " +
      "}}";
  }
}
