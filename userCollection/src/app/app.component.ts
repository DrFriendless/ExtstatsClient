import { Component, OnDestroy, OnInit } from "@angular/core"
import { HttpClient } from "@angular/common/http";
import { Collection } from "extstats-core";
import { DataSourceComponent, UserDataService } from "extstats-angular"
import { Subscription } from "rxjs"

@Component({
  selector: 'user-collection',
  templateUrl: './app.component.html'
})
export class UserCollectionComponent extends DataSourceComponent<Collection> implements OnInit, OnDestroy {
  private static DEFAULT_SELECTOR = "rated(ME)";
  public data: Collection;
  private dataSubscription: Subscription;

  constructor(http: HttpClient, userDataService: UserDataService) {
    super(http, userDataService, UserCollectionComponent.DEFAULT_SELECTOR);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.data$.subscribe(collection => this.processData(collection));
  }

  public ngOnDestroy() {
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
  }

  private processData(collection: Collection) {
    console.log("processData");
    console.log(collection);
    this.data = collection;
  }

  public selectorChanged(selector: string) {
    if (selector) super.next(selector);
  }

  protected getQueryResultFormat(): string {
    return "Collection";
  }

  protected getQueryVariables(): { [p: string]: string } {
    return {};
  }

  protected getApiKey(): string {
    return "gb0l7zXSq47Aks7YHnGeEafZbIzgmGBv5FouoRjJ";
  }
}
