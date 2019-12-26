import { Component } from "@angular/core"
import { HttpClient } from "@angular/common/http";
import { GraphQuerySourceComponent, UserDataService} from "extstats-angular";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

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
  templateUrl: './app.component.html'
})
export class UserCollectionComponent extends GraphQuerySourceComponent<Result> {
  private static DEFAULT_SELECTOR = "rated(ME)";
  private selector = UserCollectionComponent.DEFAULT_SELECTOR;
  public geek: string;
  public pageData$: Observable<Data> = this.data$.pipe(map(d => d.geekgames));

  constructor(http: HttpClient, userDataService: UserDataService) {
    super(http, userDataService);
  }

  protected buildQuery(geek: string): string {
    this.geek = geek;
    return `{geekgames(selector: "${this.selector}", vars: [{name: "ME", value: "${geek}"}]) {` +
      " games { bggid name bggRanking yearPublished weight subdomain } " +
      " geekGames { bggid rating } " +
      "}}";
  }

  protected getApiKey(): string {
    return "gb0l7zXSq47Aks7YHnGeEafZbIzgmGBv5FouoRjJ";
  }
}
