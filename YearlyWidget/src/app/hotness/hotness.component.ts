import {AfterViewInit, Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {LoaderComponent, PlaysViewComponent, UserConfigService} from "extstats-angular";
import {Result} from "../app.component";
// @ts-ignore
import {ExtstatsApi, Hotness, MostPlayedEntry} from "extstats-api";
import {Column, ColumnParams, DataTable, DataTableBody, DataTableController, DataTableHead} from "extstats-datatable";

@Component({
  selector: 'yearly-hotness',
  imports: [
    DataTable,
    DataTableBody,
    DataTableController,
    DataTableHead,
    LoaderComponent,
    DataTable,
    DataTableBody,
    DataTableController,
    DataTableHead,
    LoaderComponent
  ],
  templateUrl: './hotness.component.html'
})
export class YearlyHotnessComponent implements OnChanges {
  data: Hotness | undefined;
  loading = false;
  @Input('year') year: number | undefined;
  private params: ColumnParams<MostPlayedEntry>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The hot game",
      valueHtml: (r: MostPlayedEntry) =>  `<a href="https://boardgamegeek.com/boardgame/${r.bggid}">${r.name}</a>`,
      classname: "col-game-name"
    },
    { field: "geeks", name: "Geeks Playing", tooltip: "Distinct players of the game in this year", classname: "col-number" },
    { field: "plays", name: "Total Plays", tooltip: "Plays by all players in this year", classname: "col-number" },
    { field: "rating", name: "Rating", tooltip: "Your rating for this game", classname: "col-rating",
      valueHtml: (r: MostPlayedEntry) => (r.rating && r.rating > 0) ? r.rating.toString() : ""
    },
    {
      field: "wantToBuy", name: "WTB", tooltip: "Want to buy", classname: "col-boolean",
      valueHtml: (r: MostPlayedEntry) => r.wantToBuy ? "✓" : ""
    },
    {
      field: "wantToPlay", name: "WTP", tooltip: "Want to play", classname: "col-boolean",
      valueHtml: (r: MostPlayedEntry) => r.wantToPlay ? "✓" : ""
    },
    {
      field: "wantInTrade", name: "WIT", tooltip: "Want in trade", classname: "col-boolean",
      valueHtml: (r: MostPlayedEntry) => r.wantInTrade ? "✓" : ""
    },
    {
      field: "wish", name: "Wish", tooltip: "Your wishlist rating for this game", classname: "col-number",
      valueHtml: (r: MostPlayedEntry) => r.wish > 0 ? r.wish.toString() : ""
    },
    {
      field: "plays", name: "Your Plays", tooltip: "Your plays of this game", classname: "col-number",
      valueHtml: (r: MostPlayedEntry) => r.yourPlays > 0 ? r.yourPlays.toString() : ""
    }
  ];
  columns = this.params.map(p => new Column(p));

  constructor(private api: ExtstatsApi, private userService: UserConfigService) {
  }

  async refresh() {
    const geek = this.userService.getAGeek();
    if (!geek || !this.year) return;
    this.loading = true;
    this.data = await this.api.getHotness(geek, this.year);
    this.loading = false;
  }

  async ngOnChanges(changes: SimpleChanges) {
    const y = changes["year"].currentValue;
    const old = changes["year"].previousValue;
    if (y !== old) {
      this.year = y;
      await this.refresh();
    }
  }
}
