import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { GraphQuerySourceComponent, UserDataService } from "extstats-angular";

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
export interface Result {
  geekgames: Data;
}

@Component({
  selector: 'owned-collection',
  templateUrl: './app.component.html'
})
export class UserOwnedComponent extends GraphQuerySourceComponent<Result> {
  private static DEFAULT_SELECTOR = "owned(ME)";
  private selector = UserOwnedComponent.DEFAULT_SELECTOR;
  public geek: string;

  constructor(http: HttpClient, userDataService: UserDataService) {
    super(http, userDataService);
  }

  protected buildQuery(geek: string): string {
    this.geek = geek;
    return `{geekgames(selector: "${this.selector}", vars: [{name: "ME", value: "${geek}"}]) {` +
      " games { bggid name playTime bggRanking bggRating yearPublished isExpansion } " +
      " geekGames { bggid rating shouldPlayScore years months expansion plays lastPlay firstPlay lyPlays daysSincePlayed forTrade } " +
      "}}";
  }

  protected getApiKey(): string {
    return "gb0l7zXSq47Aks7YHnGeEafZbIzgmGBv5FouoRjJ";
  }
}
