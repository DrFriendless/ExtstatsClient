import {Observable, Subscription} from "rxjs";
import {Input, OnDestroy, AfterViewInit, Component} from '@angular/core';
import {Column, ColumnParams, DataTable, DataTableBody, DataTableController, DataTableHead} from "extstats-datatable";
import {Data} from "../app.component";

interface BuyListRow {
  bggid: number;
  name: string;
  rating: number | undefined;
  yearPublished: number;
  playerCount: string;
  subdomain: string;
  weight: number;
}

@Component({
  selector: 'extstats-wantintrade',
  imports: [
    DataTableController,
    DataTableBody,
    DataTableHead,
    DataTable,
    DataTableBody,
    DataTableHead,
    DataTable,
    DataTableBody,
    DataTableController,
    DataTableHead
  ],
  templateUrl: './wantintrade.component.html'
})
export class WantintradeComponent implements OnDestroy, AfterViewInit {
  @Input('data') data$!: Observable<Data>;
  private dataSubscription: Subscription | undefined;
  private params: ColumnParams<BuyListRow>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The game you want in trade",
      valueHtml: (r: BuyListRow) =>  `<a href="https://boardgamegeek.com/boardgame/${r.bggid}">${r.name}</a>`,
      classname: "wide"
    },
    { field: "rating", name: "Rating", tooltip: "Your rating for this game" },
    { field: "yearPublished", name: "Year Published", tooltip: "Year this game was first published" },
    { field: "playerCount", name: "Players", tooltip: "How many plahyers can play this game" },
    { field: "subdomain", name: "Subdomain", tooltip: "BGG subdomain for this game" },
    { field: "weight", name: "Weight", tooltip: "BGG weight for this game" },

  ];
  columns = this.params.map(c => new Column<BuyListRow>(c));
  rows: BuyListRow[] = [];

  public ngOnDestroy() {
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
  }

  public ngAfterViewInit() {
    this.dataSubscription = this.data$.subscribe(collection => this.processData(collection));
  }

  protected processData(data: Data): void {
    const geekGames = data.geekGames.filter(gg => gg.wantInTrade);
    this.rows = geekGames.map(gg => {
      const g = data.gamesIndex[gg.bggid];
      return {
        bggid: gg.bggid,
        name: g.name,
        rating: gg.rating < 1 ? undefined : gg.rating,
        yearPublished: g.yearPublished,
        playerCount: (g.minPlayers === g.maxPlayers) ? g.minPlayers.toString() : `${g.minPlayers}-${g.maxPlayers}`,
        subdomain: g.subdomain,
        weight: g.weight ? Math.round(g.weight * 100)/100 : undefined
      } as BuyListRow;
    })
  }
}
