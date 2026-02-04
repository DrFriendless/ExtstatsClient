import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs/internal/Subscription";
import { WarTableRow } from "extstats-core";
import {
  ButtonGroupButtonDirective,
  ButtonGroupComponent,
  DocumentationComponent,
  LoaderComponent
} from "extstats-angular";
import {Column, DataTable, DataTableBody, DataTableController, DataTableHead} from "extstats-datatable";
import {ExtstatsApi} from "extstats-api";

@Component({
  selector: 'war-table',
  imports: [
    LoaderComponent,
    DataTableController,
    DataTable,
    DataTableHead,
    DataTableBody,
    ButtonGroupComponent,
    ButtonGroupButtonDirective,
    DocumentationComponent,
  ],
  templateUrl: './app.component.html'
})
export class WarTableComponent implements OnDestroy, AfterViewInit {
  public rows: WarTableRow[] = [];
  public columns: Column<WarTableRow>[] = [];
  private subscription: Subscription | undefined;
  public loading = false;

  constructor(private api: ExtstatsApi) {
    this.columns.push(new Column<WarTableRow>({ name: "Geek", field: "geek", tooltip: "BGG User",
      valueHtml: r => `<a href="/geek.html?geek=${r.geekName}">${r.geekName}</a>` }));
    this.columns.push(new Column<WarTableRow>({ name: "Total Plays", field: "totalPlays", tooltip: "Total plays of all games as recorded by Extended Stats"}));
    this.columns.push(new Column<WarTableRow>({ name: "Distinct Games", field: "distinctGames", tooltip: "Number of different games with recorded plays"}));
    this.columns.push(new Column<WarTableRow>({ name: "Owned", field: "owned", tooltip: "Number of games this geek owns"}));
    this.columns.push(new Column<WarTableRow>({ name: "Want in Trade", field: "want", tooltip: "Number of games this geek wants in trade"}));
    this.columns.push(new Column<WarTableRow>({ name: "Wishlist", field: "wish", tooltip: "Number of games on this geek's wishlist"}));
    this.columns.push(new Column<WarTableRow>({ name: "For Trade", field: "trade", tooltip: "Number of games this geek has for trade"}));
    this.columns.push(new Column<WarTableRow>({ name: "SdJ", field: "sdj", tooltip: "Number of different Spiel des Jahre winners played"}));
    this.columns.push(new Column<WarTableRow>({ name: "BGG Top 50", field: "top50", tooltip: "Number of different games in the BGG Top 50 played"}));
    this.columns.push(new Column<WarTableRow>({ name: "Top 100", field: "ext100", tooltip: "Number of different games in the Extended Stats Top 100 played"}));
    this.columns.push(new Column<WarTableRow>({ name: "Prev Owned", field: "prevOwned", tooltip: "Number of games previously owned by this geek"}));
    this.columns.push(new Column<WarTableRow>({ name: "Friendless", field: "friendless", tooltip: "Friendless Metric for this geek"}));
    this.columns.push(new Column<WarTableRow>({ name: "CFM", field: "cfm", tooltip: "Continuous Friendless Metric for this geek"}));
    this.columns.push(new Column<WarTableRow>({ name: "0s", field: "zeros", tooltip: "Number of games this geek owns that they have played 0 times"}));
    this.columns.push(new Column<WarTableRow>({ name: "10s", field: "tens", tooltip: "Number of games this geek owns that they have played 10+ times"}));
    this.columns.push(new Column<WarTableRow>({ name: "H-index", field: "hindex", tooltip: "This geek's H-index"}));
    this.columns.push(new Column<WarTableRow>({
      name: "Hr-index",
      nameHtml: "H<sub>r</sub>-index",
      field: "hrindex",
      tooltip: "This geek's rational H-index",
    }));
    this.columns.push(new Column<WarTableRow>({ name: "G-index", field: "gindex", tooltip: "This geek's G-index"}));
  }

  public async ngAfterViewInit(): Promise<void> {
    this.loading = true;
    this.rows = await this.api.getWarTable();
    this.rows.forEach(r => {
      // round to a number of digits which is nice to look at
      r.hrindex = Math.floor(r.hrindex * 100) / 100;
    });
    this.loading = false;
  }

  public ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
