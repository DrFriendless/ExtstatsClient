import {AfterViewInit, Component} from '@angular/core';
import {
  Column,
  ColumnParams,
  DataTable,
  DataTableBody,
  DataTableController,
  DataTableHead,
} from "extstats-datatable";
import {ExtstatsApi} from "extstats-api";
import {LoaderComponent, UserConfigService} from "extstats-angular";

interface Row {
  bggid: number;
  yearPublished: number;
  name: string;
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
    LoaderComponent
  ],
  templateUrl: './most-unusual.component.html'
})
export class MostUnusualComponent implements AfterViewInit {
  private params: ColumnParams<Row>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The unusual game",
      valueHtml: (r: Row) =>  `<a href="https://boardgamegeek.com/boardgame/${r.bggid}">${r.name}</a>`,
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

  constructor(private api: ExtstatsApi, private userService: UserConfigService) {
  }

  async ngAfterViewInit(): Promise<void> {
    await this.refresh();
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
      this.data = await this.api.retrieve(`{mostunusual(geek: "${this.geek}", count: 50) { bggid yearPublished name bggRating weight minPlayers maxPlayers bggRanking usersOwned } }`) as Data;
      this.processData(this.data);
      this.loading = false;
    }
  }

  private playersString(min: number, max: number): string {
    if (min === max) {
      return min.toString();
    } else {
      return `${min}-${max}`;
    }
  }
}
