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

interface RawRow {
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
  tags: string[] | undefined;
  wish: number;
}

interface Row extends TaggedGame {
  yearPublished: number;
  bggRating: number;
  weight: number;
  bggRanking: number;
  minPlayers: number;
  maxPlayers: number;
  rating: number;
  wantToBuy: boolean;
  wantToPlay: boolean;
  wantInTrade: boolean;
  preordered: boolean;
  wish: number;
}

interface RawData {
  mostplayedunplayed: RawRow[]
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
    LoaderComponent,
    BoardGameLinkComponent
  ],
  templateUrl: './most-played-unplayed.component.html'
})
export class MostPlayedUnplayedComponent implements AfterViewInit {
  @ViewChild('boardgame') boardgame!: TemplateRef<RowContext<Row>>;
  private params: ColumnParams<Row>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The game everyone else is playing",
      template: this.boardgame,
      classname: "col-game-name"
    },
    { field: "yearPublished", name: "Published", tooltip: "Year this game was published", classname: "col-year",
      valueHtml: (r: Row) => r.yearPublished.toString()
    },
    { field: "bggRanking", name: "BGG Ranking", tooltip: "Ranking of this game on BoardGameGeek", classname: "col-ranking",
      valueHtml: (r: Row) => r.bggRanking.toString()
    },
    { field: "bggRating", name: "BGG Rating", tooltip: "Rating of this game on BoardGameGeek", classname: "col-rating",
      valueHtml: (r: Row) => r.bggRating.toString()
    },
    { field: "weight", name: "BGG Weight", tooltip: "Weight of this game as assessed by BGG", classname: "col-number",
      valueHtml: (r: Row) => r.weight.toString()
    },
    { field: "minPlayers", name: "Players", tooltip: "Number of players this game takes", classname: "col-number",
      valueHtml: (r: Row) => this.playersString(r.minPlayers, r.maxPlayers)
    },
    {
      field: "rating", name: "Rating", tooltip: "Your rating for this game", classname: "col-rating",
      valueHtml: (r: Row) => r.rating > 0 ? r.rating.toString() : ""
    },
    {
      field: "wantToBuy", name: "WTB", tooltip: "Want to buy", classname: "col-boolean",
      valueHtml: (r: Row) => r.wantToBuy ? "✓" : ""
    },
    {
      field: "wantToPlay", name: "WTP", tooltip: "Want to play", classname: "col-boolean",
      valueHtml: (r: Row) => r.wantToPlay ? "✓" : ""
    },
    {
      field: "wantInTrade", name: "WIT", tooltip: "Want in trade", classname: "col-boolean",
      valueHtml: (r: Row) => r.wantInTrade ? "✓" : ""
    },
    {
      field: "preordered", name: "Preorder", tooltip: "Whether yuou have this game preordered", classname: "col-boolean",
      valueHtml: (r: Row) => r.preordered ? "✓" : ""
    },
    {
      field: "wish", name: "Wish", tooltip: "Your wishlist rating for this game", classname: "col-number",
      valueHtml: (r: Row) => r.wish > 0 ? r.wish.toString() : ""
    }
  ];
  columns: Column<Row>[] = [];
  rows: Row[] = [];
  geek: string | undefined;
  loading = false;

  constructor(private api: ExtstatsApi, private userService: UserConfigService, public tagService: UserTagService) {
  }

  async ngAfterViewInit(): Promise<void> {
    await this.refresh();
    this.params[0].template = this.boardgame;
    this.columns = this.params.map(c => new Column<Row>(c));
  }

  protected processData(data: RawData): any {
    this.rows = data.mostplayedunplayed.map(d => {
      return {...d, ...d.game}
    });
  }

  private async refresh() {
    this.geek = this.userService.getAGeek();
    if (this.geek) {
      this.loading = true;
      const data = await this.api.retrieve(`{mostplayedunplayed(geek: "${this.geek}", count: 50) { rating wantToBuy wantToPlay wantInTrade preordered wish tags game { bggid name minPlayers maxPlayers yearPublished bggRanking bggRating weight } } }`) as RawData;
      this.processData(data);
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
