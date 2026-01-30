import {AfterViewInit, Component, ViewChild} from "@angular/core"
import {GraphQuerySourceComponent, LoaderComponent, UserConfigService, SelectorComboComponent} from "extstats-angular";
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
    RatingByRankingGraphComponent,
    SelectorComboComponent
  ],
  templateUrl: './app.component.html'
})
export class UserCollectionComponent extends GraphQuerySourceComponent<Result> implements AfterViewInit {
  private static DEFAULT_SELECTOR = "rated(ME)";
  private selector = UserCollectionComponent.DEFAULT_SELECTOR;
  public pageData$: Observable<Data> = this.data$.pipe(map(d => d.geekgames));
  @ViewChild(SelectorComboComponent) selectorCombo: SelectorComboComponent | undefined;

  constructor(api: ExtstatsApi, private userConfigService: UserConfigService) {
    super(api);
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.selectorCombo) {
      this.selectorCombo.setDefault(UserCollectionComponent.DEFAULT_SELECTOR);
      this.selectorCombo.setSelected(UserCollectionComponent.DEFAULT_SELECTOR);
    }
  }

  onSelectorChosen(event: string) {
    this.selector = event;
    super.refresh();
  }

  protected buildQuery(): string {
    return `{geekgames(selector: "${this.selector}", vars: [{name: "ME", value: "${this.userConfigService.getAGeek()}"}]) {` +
      " games { bggid name bggRanking yearPublished weight subdomain } " +
      " geekGames { bggid rating } " +
      "}}";
  }
}
