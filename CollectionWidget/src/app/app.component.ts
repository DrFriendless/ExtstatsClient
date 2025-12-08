import { Component } from "@angular/core"
import {GraphQuerySourceComponent, LoaderComponent, UserDataService} from "extstats-angular";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";
import {ExtstatsApi} from "extstats-api";
import {RatingsByYearGraphComponent} from "./ratings-by-year-graph/ratings-by-year-graph.component";
import {FavesByYearTableComponent} from "./faves-by-year-table/faves-by-year-table.component";
import {RatingVsWeightComponent} from "./rating-vs-weight/rating-vs-weight.component";
import {RatingByRankingGraphComponent} from "./rating-by-ranking-graph/rating-by-ranking-graph.component";

export interface GeekGameResult {
  bggid: number;
  rating: number;
}
export interface GameResult {
  bggid: number;
  name: string;
  bggRanking: number;
  yearPublished: number;
  weight: number;
  subdomain: string;
}
export interface Data {
  geekGames: GeekGameResult[];
  games: GameResult[];
}
interface Result {
  geekgames: Data;
}

@Component({
  selector: 'user-collection',
  imports: [
    LoaderComponent,
    RatingsByYearGraphComponent,
    FavesByYearTableComponent,
    RatingVsWeightComponent,
    RatingByRankingGraphComponent
  ],
  templateUrl: './app.component.html'
})
export class UserCollectionComponent extends GraphQuerySourceComponent<Result> {
  private static DEFAULT_SELECTOR = "rated(ME)";
  private selector = UserCollectionComponent.DEFAULT_SELECTOR;
  public pageData$: Observable<Data> = this.data$.pipe(map(d => d.geekgames));

  constructor(api: ExtstatsApi, userDataService: UserDataService) {
    super(api, userDataService);
  }

  protected buildQuery(geek: string): string {
    this.geek = geek;
    return `{geekgames(selector: "${this.selector}", vars: [{name: "ME", value: "${geek}"}]) {` +
      " games { bggid name bggRanking yearPublished weight subdomain } " +
      " geekGames { bggid rating } " +
      "}}";
  }
}
