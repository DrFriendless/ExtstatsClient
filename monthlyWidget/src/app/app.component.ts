import { Component, OnInit } from "@angular/core"
import { DataSourceComponent, UserDataService } from 'extstats-angular';
import { CollectionWithMonthlyPlays } from "extstats-core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs"
import { map, share } from "rxjs/operators"
import { indexPlays, PlayAndGamesIndex } from "./play-index"

@Component({
  selector: 'monthly-plays',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class MonthlyWidget extends DataSourceComponent<CollectionWithMonthlyPlays> implements OnInit {
  private static DEFAULT_SELECTOR = "any(played(ME),owned(ME))";
  public playAndGame$: Observable<PlayAndGamesIndex>;

  constructor(http: HttpClient, userDataService: UserDataService) {
    super(http, userDataService, MonthlyWidget.DEFAULT_SELECTOR);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.playAndGame$ = this.data$.pipe(map(indexPlays), share());
  }

  protected getQueryResultFormat(): string {
    return "CollectionWithMonthlyPlays";
  }

  protected getQueryVariables(): { [p: string]: string } {
    return {};
  }

  protected getApiKey(): string {
    return "gb0l7zXSq47Aks7YHnGeEafZbIzgmGBv5FouoRjJ";
  }

  protected getExtra(): { [key: string]: any } {
    return { extra: "minus(owned(ME), expansions(), books())" };
  }
}
