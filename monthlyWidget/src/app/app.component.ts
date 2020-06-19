import {Component} from "@angular/core"
import { GraphQuerySourceComponent, UserDataService} from 'extstats-angular';
import { HttpClient } from "@angular/common/http";
import {Observable} from "rxjs";
import {indexPlays, PlayAndGamesIndex} from "./play-index";
import {map, share} from "rxjs/operators";

export interface PlayData {
  year: number;
  month: number;
  expansion: boolean;
  quantity: number;
  bggid: number;
}
export interface CountData {
  year: number;
  month: number;
  count: number;
}
export interface GeekGameData {
  owned: boolean;
  game: {
    bggid: number;
    name: string;
  }
}
export interface MonthlyData {
  plays: PlayData[];
  counts: CountData[];
  geekGames: GeekGameData[];
}
export interface Result {
  monthly: MonthlyData;
}

@Component({
  selector: 'monthly-plays',
  templateUrl: './app.component.html'
})
export class MonthlyWidget extends GraphQuerySourceComponent<Result> {
  private static DEFAULT_SELECTOR = "any(played(ME),owned(ME))";
  playsAndGame$: Observable<PlayAndGamesIndex>;
  selector = MonthlyWidget.DEFAULT_SELECTOR;

  constructor(http: HttpClient, userDataService: UserDataService) {
    super(http, userDataService);
    this.playsAndGame$ = this.data$.pipe(map(r => indexPlays(r.monthly)), share());
  }

  protected getApiKey(): string {
    return "gb0l7zXSq47Aks7YHnGeEafZbIzgmGBv5FouoRjJ";
  }

  protected buildQuery(geek: string): string {
    return `{monthly(selector: "${this.selector}", vars: [{name: "ME", value: "${geek}"}]) {` +
      " plays { year month expansion quantity bggid } " +
      " counts { year month count } " +
      " geekGames { owned game { bggid name } }" +
      "}}";
  }
}
