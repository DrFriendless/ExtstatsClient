import { AfterViewInit, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from "rxjs/internal/Subscription";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { WarTableRow } from "extstats-core";

@Component({
  selector: 'war-table',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class WarTableComponent implements OnDestroy, AfterViewInit {
  private loadData$;
  public rows: WarTableRow[] = [];
  private subscription: Subscription;
  public docCollapsed = true;
  public loading = false;

  constructor(private http: HttpClient) {}

  public ngAfterViewInit(): void {
    const options = {
      headers: new HttpHeaders().set("x-api-key", "gb0l7zXSq47Aks7YHnGeEafZbIzgmGBv5FouoRjJ")
    };
    this.loadData$ = this.http.get("https://api.drfriendless.com/v1/wartable", options);
    this.loading = true;
    this.subscription = this.loadData$.subscribe(result => {
      this.rows = result;
      this.rows.forEach(r => {
        // round to a number of digits which is nice to look at
        r.hrindex = Math.floor(r.hrindex * 100) / 100;
      });
      this.loading = false;
    });
  }

  public ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
