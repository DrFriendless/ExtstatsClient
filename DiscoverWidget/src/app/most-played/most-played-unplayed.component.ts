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
  game : {
    bggid: number;
    yearPublished: number;
    name: string;
    bggRating: number;
    weight: number;
    bggRanking: number;
    minPlayers: number;
    maxPlayers: number;
  }
  rating: number;
  wantToBuy: boolean;
  wantToPlay: boolean;
  wantInTrade: boolean;
  preordered: boolean;
  wish: number;
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
      valueHtml: (r: Row) =>  `<a href="https://boardgamegeek.com/boardgame/${r.game.bggid}">${r.game.name}</a>`,
      classname: "wide"
     },
    { field: "yearPublished", name: "Published", tooltip: "Year this game was published",
      valueHtml: (r: Row) => r.game.yearPublished.toString()
    },
    { field: "bggRanking", name: "BGG Ranking", tooltip: "Ranking of this game on BoardGameGeek",
      valueHtml: (r: Row) => r.game.bggRanking.toString()
    },
    { field: "bggRating", name: "BGG Rating", tooltip: "Rating of this game on BoardGameGeek",
      valueHtml: (r: Row) => r.game.bggRating.toString()
    },
    { field: "weight", name: "BGG Weight", tooltip: "Weight of this game as assessed by BGG",
      valueHtml: (r: Row) => r.game.weight.toString()
    },
    { field: "minPlayers", name: "Players", tooltip: "Number of players this game takes",
      valueHtml: (r: Row) => this.playersString(r.game.minPlayers, r.game.maxPlayers)
    },
    {
      field: "rating", name: "Rating", tooltip: "Your rating for this game",
      valueHtml: (r: Row) => r.rating > 0 ? r.rating.toString() : ""
    },
    {
      field: "wantToBuy", name: "WTB", tooltip: "Want to buy",
      valueHtml: (r: Row) => r.wantToBuy ? "✓" : ""
    },
    {
      field: "wantToPlay", name: "WTP", tooltip: "Want to play",
      valueHtml: (r: Row) => r.wantToPlay ? "✓" : ""
    },
    {
      field: "wantInTrade", name: "WIT", tooltip: "Want in trade",
      valueHtml: (r: Row) => r.wantInTrade ? "✓" : ""
    },
    {
      field: "preordered", name: "Preorder", tooltip: "Whether yuou have this game preordered",
      valueHtml: (r: Row) => r.preordered ? "✓" : ""
    },
    {
      field: "wish", name: "Wish", tooltip: "Your wishlist rating for this game",
      valueHtml: (r: Row) => r.wish > 0 ? r.wish.toString() : ""
    }
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
      this.data = await this.api.retrieve(`{mostplayedunplayed(geek: "${this.geek}", count: 50) { rating wantToBuy wantToPlay wantInTrade preordered wish game { bggid name minPlayers maxPlayers yearPublished bggRanking bggRating weight } } }`) as Data;
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
