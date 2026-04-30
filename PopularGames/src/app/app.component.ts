import {AfterViewInit, Component, OnDestroy, TemplateRef, ViewChild} from '@angular/core';
import { Subscription } from "rxjs/internal/Subscription";
import {
  Column,
  ColumnParams,
  DataTable,
  DataTableBody,
  DataTableController,
  DataTableHead,
  RowContext
} from "extstats-datatable";
import {
  BoardGameLinkComponent,
  LoaderComponent, UserTagService
} from "extstats-angular";
import {ExtstatsApi} from "extstats-api";

interface Row {
    bggid: number;
    name: string;
    yearPublished: number;
    bggRanking: number;
    bggRating: number;
    weight: number;
    minPlayers: number;
    maxPlayers: number;
    nickels: number;
    dimes: number;
}

interface RawRow {
  game: {
    bggid: number;
    name: string;
    yearPublished: number;
    bggRanking: number;
    bggRating: number;
    weight: number;
    minPlayers: number;
    maxPlayers: number;
  };
  nickels: number;
  dimes: number;
  bggid: number;
}

interface RawData {
  mostnickelsanddimes: RawRow[]
}

@Component({
  selector: 'popular-games',
  imports: [
    DataTableController,
    DataTable,
    DataTableHead,
    DataTableBody,
    DataTableBody,
    DataTableHead,
    LoaderComponent,
    BoardGameLinkComponent
  ],
  templateUrl: "./app.component.html"
})
export class AppComponent implements OnDestroy, AfterViewInit {
  @ViewChild('boardgame') boardgame!: TemplateRef<RowContext<Row>>;
  private params: ColumnParams<Row>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The game everyone keeps playing",
      template: this.boardgame,
      classname: "col-game-name"
    },
    { field: "nickels", name: "Nickels", tooltip: "The number of times a player has played this game 5-9 times in a year", classname: "col-number",
      valueHtml: (r: Row) => r.nickels.toString()
    },
    { field: "dimes", name: "Dimes", tooltip: "The number of times a player has played this game 10+ times in a year", classname: "col-number",
      valueHtml: (r: Row) => r.dimes.toString()
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
    }
    ];
  public rows: Row[] = [];
  private subscription: Subscription | undefined;
  public columns: Column<Row>[] = [];
  public loading = false;

  constructor(private api: ExtstatsApi, public tagService: UserTagService) {
  }

  async ngAfterViewInit(): Promise<void> {
    await this.refresh();
    this.params[0].template = this.boardgame;
    this.columns = this.params.map(c => new Column<Row>(c));
  }

  private async refresh() {
      this.loading = true;
      const data = await this.api.retrieve(`{mostnickelsanddimes(count: 100) { nickels dimes game { bggid name minPlayers maxPlayers yearPublished bggRanking bggRating weight } } }`) as RawData;
      this.rows = data.mostnickelsanddimes.map(rr => { return { ...rr, ...rr.game } });
      this.loading = false;
  }

  public ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  private playersString(min: number, max: number): string {
    if (min === max) {
      return min.toString();
    } else {
      return `${min}-${max}`;
    }
  }
}
