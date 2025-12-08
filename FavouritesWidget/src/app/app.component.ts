import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  ButtonGroupButtonDirective,
  ButtonGroupComponent, ConfigComponent,
  GraphQuerySourceComponent,
  LoaderComponent,
  UserDataService
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
    ButtonGroupComponent,
    ButtonGroupButtonDirective,
    ConfigComponent
  ],
  templateUrl: './app.component.html'
})
export class FavouritesComponent extends GraphQuerySourceComponent<Result> implements OnInit, OnDestroy {
  private static DEFAULT_SELECTOR = "all(played(ME), rated(ME))";
  INITIAL_SELECTOR = FavouritesComponent.DEFAULT_SELECTOR;
  data: Data | undefined;
  private selector = this.INITIAL_SELECTOR;
  private dataSubscription: Subscription | undefined;

  constructor(api: ExtstatsApi, userDataService: UserDataService) {
    super(api, userDataService);
  }

  override ngOnInit() {
    super.ngOnInit();
    this.refresh();
    this.dataSubscription = this.data$.subscribe(data => {
      this.data = data.geekgames;
      console.log(this.data);
    });
  }

  ngOnDestroy(): void {
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
  }

  selectorChanged(selector: string) {
    this.selector = selector;
    this.refresh();
  }

  protected buildQuery(geek: string): string {
    return `{geekgames(selector: "${this.selector}", vars: [{name: "ME", value: "${geek}"}]) {` +
      " games { bggid name playTime bggRanking bggRating yearPublished subdomain weight } " +
      " geekGames { bggid rating shouldPlayScore plays years months expansion lyPlays lyMonths firstPlay lastPlay daysSincePlayed } " +
      "}}";
  }
}
