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
}

interface Data {
  mostplayedunplayed: Row[]
}

@Component({
  selector: 'most-played-unplayed',
  imports: [
    DataTableController,
    DataTableBody,
    DataTableHead,
    DataTable,
    DataTableBody,
    DataTableHead,
    LoaderComponent
  ],
  templateUrl: './most-played-unplayed.component.html'
})
export class MostPlayedUnplayedComponent implements AfterViewInit {
  private params: ColumnParams<Row>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The game everyone else is playing",
      valueHtml: (r: Row) =>  `<a href="https://boardgamegeek.com/boardgame/${r.bggid}">${r.name}</a>`,
      classname: "wide"
     },
    { field: "yearPublished", name: "Published", tooltip: "Year this game was published" },
    { field: "bggRanking", name: "BGG Ranking", tooltip: "Ranking of this game on BoardGameGeek" },
    { field: "bggRating", name: "BGG Rating", tooltip: "Rating of this game on BoardGameGeek" },
    { field: "weight", name: "BGG Weight", tooltip: "Weight of this game as assessed by BGG" },
    { field: "minPlayers", name: "Players", tooltip: "Number of players this game takes",
      valueHtml: (r: Row) => this.playersString(r.minPlayers, r.maxPlayers)
    },
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
    this.rows = data.mostplayedunplayed;
  }

  private async refresh() {
    this.geek = this.userService.getAGeek();
    if (this.geek) {
      this.loading = true;
      this.data = await this.api.retrieve(`{mostplayedunplayed(geek: "${this.geek}", count: 50) { bggid yearPublished name bggRating weight minPlayers maxPlayers bggRanking } }`) as Data;
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
