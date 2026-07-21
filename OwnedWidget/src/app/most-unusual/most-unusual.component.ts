import {AfterViewInit, Component, TemplateRef, ViewChild} from '@angular/core';
import {
  Column,
  ColumnParams,
  DataTable,
  DataTableBody,
  DataTableController,
  DataTableHead, RowContext,
} from "extstats-datatable";
import {ExtstatsApi} from "extstats-api";
import {BoardGameLinkComponent, LoaderComponent, TaggedGame, UserConfigService, UserTagService} from "extstats-angular";

interface Row extends TaggedGame {
  yearPublished: number;
  bggRating: number;
  weight: number;
  bggRanking: number;
  minPlayers: number;
  maxPlayers: number;
  usersOwned: number;
}

interface Data {
  mostunusual: Row[]
}

@Component({
  selector: 'most-unusual',
  imports: [
    DataTableController,
    DataTableBody,
    DataTableHead,
    DataTable,
    DataTableBody,
    DataTableHead,
    LoaderComponent,
    BoardGameLinkComponent
  ],
  templateUrl: './most-unusual.component.html'
})
export class MostUnusualComponent implements AfterViewInit {
  @ViewChild('boardgame') boardgame!: TemplateRef<RowContext<Row>>;
  private params: ColumnParams<Row>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The unusual game",
      template: this.boardgame,
      classname: "col-game-name"
     },
    { field: "yearPublished", name: "Published", tooltip: "Year this game was published", classname: "col-year" },
    { field: "bggRanking", name: "BGG Ranking", tooltip: "Ranking of this game on BoardGameGeek", classname: "col-ranking" },
    { field: "bggRating", name: "BGG Rating", tooltip: "Rating of this game on BoardGameGeek", classname: "col-rating" },
    { field: "usersOwned", name: "Users Owning", tooltip: "Number of BGG users owning", classname: "col-number" }
  ];
  columns = this.params.map(c => new Column<Row>(c));
  rows: Row[] = [];
  geek: string | undefined;
  loading = false;
  data: Data | undefined;

  constructor(private api: ExtstatsApi, private userService: UserConfigService, public tagService: UserTagService) {
  }

  async ngAfterViewInit(): Promise<void> {
    await this.refresh();
    this.params[0].template = this.boardgame;
    this.columns = this.params.map(c => new Column<Row>(c));
  }

  protected processData(data: Data): any {
    this.rows = data.mostunusual;
    for (const row of this.rows) {
      row.bggRating = Math.round(row.bggRating * 10) / 10;
    }
  }

  private async refresh() {
    this.geek = this.userService.getAGeek();
    if (this.geek) {
      this.loading = true;
      this.data = await this.api.retrieve(`{mostunusual(geek: "${this.geek}", count: 50) { bggid tags yearPublished name bggRating weight minPlayers maxPlayers bggRanking usersOwned } }`) as Data;
      this.processData(this.data);
      this.loading = false;
    }
  }
}
