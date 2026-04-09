import {Observable, Subscription} from "rxjs";
import {Input, OnDestroy, AfterViewInit, Component, ViewChild, TemplateRef} from '@angular/core';
import {
  Column,
  ColumnParams,
  DataTable,
  DataTableBody,
  DataTableController,
  DataTableHead,
  RowContext
} from "extstats-datatable";
import {Data} from "../app.component";
import {BoardGameLinkComponent, UserTagService} from "extstats-angular";

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
  selector: 'extstats-wanttoplay',
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
    DataTableHead,
    BoardGameLinkComponent
  ],
  templateUrl: './wanttoplay.component.html'
})
export class WanttoplayComponent implements OnDestroy, AfterViewInit {
  @ViewChild('boardgame') boardgame!: TemplateRef<RowContext<BuyListRow>>;
  @Input('data') data$!: Observable<Data>;
  private dataSubscription: Subscription | undefined;
  private params: ColumnParams<BuyListRow>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The game you want to play",
      template: this.boardgame,
      classname: "col-game-name"
    },
    { field: "rating", name: "Rating", tooltip: "Your rating for this game", classname: "col-rating" },
    { field: "yearPublished", name: "Year Published", tooltip: "Year this game was first published", classname: "col-year" },
    { field: "playerCount", name: "Players", tooltip: "How many players can play this game", classname: "col-number" },
    { field: "subdomain", name: "Subdomain", tooltip: "BGG subdomain for this game", classname: "col-subdomain" },
    { field: "weight", name: "Weight", tooltip: "BGG weight for this game", classname: "col-number" },
  ];
  columns: Column<BuyListRow>[] = [];
  rows: BuyListRow[] = [];

  constructor(public tagService: UserTagService) {
  }

  public ngOnDestroy() {
    if (this.dataSubscription) this.dataSubscription.unsubscribe();
  }

  public ngAfterViewInit() {
    this.dataSubscription = this.data$.subscribe(collection => this.processData(collection));
    this.params[0].template = this.boardgame;
    this.columns = this.params.map(c => new Column<BuyListRow>(c));
  }

  protected processData(data: Data): void {
    const geekGames = data.geekGames.filter(gg => gg.wantToPlay);
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
