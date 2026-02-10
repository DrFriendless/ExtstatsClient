import {Component, OnInit, OnDestroy, AfterViewInit, ViewChild} from '@angular/core';
import {
  GraphQuerySourceComponent,
  LoaderComponent, SelectorComboComponent, UserConfigService,
} from "extstats-angular";
import { Subscription } from "rxjs/internal/Subscription";
import {FirstPlayedVsRatingComponent} from "./first-played-vs-rating/first-played-vs-rating.component";
import {ComplexityVsRatingComponent} from "./complexity-vs-rating/complexity-vs-rating.component";
import {ComplexityVsPlaysComponent} from "./complexity-vs-plays/complexity-vs-plays.component";
import {AverageVsRatingComponent} from "./average-vs-rating/average-vs-rating.component";
import {FavouritesTableComponent} from "./favourites-table/favourites-table.component";
import {RatingVsMonthsPlayedComponent} from "./rating-vs-months-played/rating-vs-months-played.component";
import {RatingVsPlaysComponent} from "./rating-vs-plays/rating-vs-plays.component";
import {YouShouldPlayComponent} from "./you-should-play/you-should-play.component";
import {ExtstatsApi} from "extstats-api";

export interface GeekGameResult {
  bggid: number;
  shouldPlayScore: number;
  daysSincePlayed: number;
  rating: number;
  plays: number;
  lyPlays: number;
  years: number;
  months: number;
  lyMonths: number;
  expansion: boolean;
  firstPlay: number;
  lastPlay: number;
}
export interface GameResult {
  bggid: number;
  name: string;
  playTime: number;
  bggRanking: number;
  bggRating: number;
  yearPublished: number;
  subdomain: string;
  weight: number;
}
export interface Data {
  geekGames: GeekGameResult[];
  games: GameResult[];
}
export interface Result {
  geekgames: Data;
}

@Component({
  selector: 'extstats-favourites',
  imports: [
    LoaderComponent,
    FirstPlayedVsRatingComponent,
    ComplexityVsRatingComponent,
    ComplexityVsPlaysComponent,
    AverageVsRatingComponent,
    FavouritesTableComponent,
    RatingVsMonthsPlayedComponent,
    RatingVsPlaysComponent,
    YouShouldPlayComponent,
    SelectorComboComponent
  ],
  templateUrl: './app.component.html'
})
export class FavouritesComponent extends GraphQuerySourceComponent<Result> implements OnInit, OnDestroy, AfterViewInit {
  private static DEFAULT_SELECTOR = "all(played(ME),rated(ME))";
  data: Data | undefined;
  selector = FavouritesComponent.DEFAULT_SELECTOR;
  private dataSubscription: Subscription | undefined;
  @ViewChild(SelectorComboComponent) selectorCombo: SelectorComboComponent | undefined;

  constructor(api: ExtstatsApi, private userService: UserConfigService) {
    super(api);
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.selectorCombo) {
      this.selectorCombo.setDefault(FavouritesComponent.DEFAULT_SELECTOR);
      this.selectorCombo.setSelected(FavouritesComponent.DEFAULT_SELECTOR);
    }
  }

  ngOnInit() {
    this.dataSubscription = this.data$.subscribe(data => {
      this.data = data.geekgames;
    });
    this.refresh();
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
  }

  onSelectorChosen(event: string) {
    this.selector = event;
    super.refresh();
  }

  protected buildQuery(): string {
    return `{geekgames(selector: "${this.selector}", vars: [{name: "ME", value: "${this.userService.getAGeek()}"}]) {` +
      " games { bggid name playTime bggRanking bggRating yearPublished subdomain weight } " +
      " geekGames { bggid rating shouldPlayScore plays years months expansion lyPlays lyMonths firstPlay lastPlay daysSincePlayed } " +
      "}}";
  }
}
