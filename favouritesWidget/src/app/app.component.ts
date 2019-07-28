import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { UserDataService } from "extstats-angular";
import { Subscription } from "rxjs/internal/Subscription";
import { GraphQuerySourceComponent } from "./graph-query-source.component"

export function makeGamesIndex<T extends {bggid: number}>(games: T[]): Record<string, T> {
  const result = {};
  games.forEach(g => result[g.bggid] = g);
  return result;
}

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
  templateUrl: './app.component.html'
})
export class FavouritesComponent extends GraphQuerySourceComponent<Result> implements OnInit, OnDestroy {
  private static DEFAULT_SELECTOR = "all(played(ME), rated(ME))";
  public INITIAL_SELECTOR = FavouritesComponent.DEFAULT_SELECTOR;
  public data: Data;
  private selector = this.INITIAL_SELECTOR;
  private dataSubscription: Subscription;

  constructor(http: HttpClient, userDataService: UserDataService) {
    super(http, userDataService);
  }

  public ngOnInit() {
    super.ngOnInit();
    this.refresh();
    this.dataSubscription = this.data$.subscribe(data => {
      this.data = data.geekgames;
      console.log(this.data);
    });
  }

  public ngOnDestroy(): void {
    this.dataSubscription.unsubscribe();
  }

  public selectorChanged(selector: string) {
    this.selector = selector;
    this.refresh();
  }

  protected getApiKey(): string {
    return "gb0l7zXSq47Aks7YHnGeEafZbIzgmGBv5FouoRjJ";
  }

  protected buildQuery(geek: string): string {
    return `{geekgames(selector: "${this.selector}", vars: [{name: "ME", value: "${geek}"}]) {` +
      " games { bggid name playTime bggRanking bggRating yearPublished subdomain } " +
      " geekGames { bggid rating shouldPlayScore plays years months expansion lyPlays lyMonths firstPlay lastPlay daysSincePlayed } " +
      "}}";
  }
}
