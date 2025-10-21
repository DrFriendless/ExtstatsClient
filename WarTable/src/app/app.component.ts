import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs/internal/Subscription";
import { HttpClient } from "@angular/common/http";
import { WarTableRow } from "extstats-core";
import {LoaderComponent} from "extstats-angular";
import {TabDirective, TabsetComponent} from "ngx-bootstrap/tabs";
import {NgbCollapse} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'war-table',
  imports: [
    LoaderComponent,
    TabsetComponent,
    TabDirective,
    NgbCollapse,
  ],
  templateUrl: './app.component.html'
})
export class WarTableComponent implements OnDestroy, AfterViewInit {
  public rows: WarTableRow[] = [];
  private subscription: Subscription | undefined;
  public isCollapsed = true;
  public loading = false;

  constructor(private http: HttpClient) {
  }

  public ngAfterViewInit(): void {
    console.log('ngAfterViewInit');
    const loadData$ = this.http.get("https://api.drfriendless.com/v1/wartable");
    this.loading = true;
    this.subscription = loadData$.subscribe(result => {
      console.log(result);
      this.rows = (result as WarTableRow[]) || [];
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
