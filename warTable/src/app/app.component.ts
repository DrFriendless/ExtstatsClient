import { AfterViewInit, Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Subscription } from "rxjs/internal/Subscription";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { WarTableRow } from "extstats-core";
import {Column, ColumnParams} from "extstats-datatable";

@Component({
  selector: 'war-table',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.Emulated
})
export class WarTableComponent implements OnDestroy, AfterViewInit {
  private loadData$;
  private subscription: Subscription;
  private params: ColumnParams<WarTableRow>[] = [
    {field: "geekName", name: "Geek",
      valueHtml: (row: WarTableRow) => `<a href="/geek.html?geek=${row.geekName}">${row.geekName}</a>` },
    {field: "totalPlays", name: "Total Plays", classname: "narrow",
      tooltip: "Total plays of all games as recorded by Extended Stats"},
    {field: "distinctGames", name: "Distinct Games", classname: "narrow",
      tooltip: "The number of times you have played this game"},
    {field: "owned", name: "Owned", classname: "narrow", tooltip: "Number of games this geek owns"},
    {field: "want", name: "Want in Trade", classname: "narrow", tooltip: "Number of games this geek wants in trade"},
    {field: "wish", name: "Wishlist", classname: "narrow", tooltip: "Number of games on this geek's wishlist"},
    {field: "trade", name: "For Trade", classname: "narrow", tooltip: "Number of games this geek has for trade" },
    {field: "sdj", name: "SdJ", classname: "narrow",
      tooltip: "Number of different Spiel des Jahre winners played"},
    {field: "top50", name: "BGG Top 50", classname: "narrow",
      tooltip: "Number of different games in the BGG Top 50 played"},
    {field: "ext100", name: "Extstats Top 100", classname: "narrow",
      tooltip: "Number of different games in the Extended Stats Top 100 played"},
    {field: "prevOwned", name: "Prev Owned", classname: "narrow", tooltip: "Number of games previously owned by this geek"},
    {field: "friendless", name: "Friendless Metric", classname: "narrow", tooltip: "Friendless Metric for this geek"},
    {field: "cfm", name: "CFM", classname: "narrow", tooltip: "Continuous Friendless Metric for this geek",
      valueTooltip: (row: WarTableRow) => `Utilisation ${row.utilisation}%`},
    {field: "zeros", name: "0s", classname: "narrow", tooltip: "Number of games this geek owns that they have played 0 times"},
    {field: "tens", name: "10s", classname: "narrow", tooltip: "Number of games this geek owns that they have played 10+ times"},
    {field: "hindex", name: "H-Index", classname: "narrow", tooltip: "This geek's H-index"},
    {field: "hrindex", name: "Hr-Index", classname: "narrow", tooltip: "This geek's rational H-index"},
    {field: "gindex", name: "G-Index", classname: "narrow", tooltip: "This geek's G-index"},
  ];
  columns = this.params.map(c => new Column<WarTableRow>(c));
  rows: WarTableRow[] = [];
  loading = false;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
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

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
