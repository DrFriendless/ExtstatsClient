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
  name: string;
  bggRating: number;
  weight: number;
  playTime: number;
  subdomain: string;
  wantToPlay: boolean;
  shouldPlayScore: number;
}

interface RawData {
  geekgames: {
    games: {
      bggid: number;
      name: string;
      playTime: number;
      bggRating: number;
      subdomain: string;
      weight: number;
    }[],
    geekGames: {
      bggid: number;
      wantToPlay: boolean;
      shouldPlayScore: number;
    }[]
  }
}

@Component({
  selector: 'shame-shelf',
  imports: [
    DataTableController,
    DataTableBody,
    DataTableHead,
    DataTable,
    DataTableBody,
    DataTableHead,
    LoaderComponent
  ],
  templateUrl: './shame-shelf.component.html'
})
export class ShameShelfComponent implements AfterViewInit {
  private static DEFAULT_SELECTOR = "minus(owned(ME),played(ME),expansions(),books())";
  private readonly selector = ShameShelfComponent.DEFAULT_SELECTOR;

  private params: ColumnParams<Row>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The game of shame",
      valueHtml: (r: Row) =>  `<a href="https://boardgamegeek.com/boardgame/${r.bggid}">${r.name}</a>`,
      classname: "wide"
    },
    { field: "bggRating", name: "BGG Rating", tooltip: "Rating of this game on BoardGameGeek",
      valueHtml: (r: Row) => (!r.bggRating) ? "" : ((Math.floor(r.bggRating * 10))/10).toString()
    },
    { field: "weight", name: "BGG Weight", tooltip: "Weight of this game as assessed by BGG",
      valueHtml: (r: Row) => (!r.weight) ? "" : ((Math.floor(r.weight * 10))/10).toString()
    },
    { field: "subdomain", name: "Subdomain", tooltip: "BGG Subdomain" },
    {
      field: "wantToPlay", name: "WTP", tooltip: "Want to play",
      valueHtml: (r: Row) => r.wantToPlay ? "✓" : ""
    }
  ];
  columns = this.params.map(c => new Column<Row>(c));
  rows: Row[] = [];
  geek: string | undefined;
  loading = false;

  constructor(private api: ExtstatsApi, private userService: UserConfigService) {
  }

  async ngAfterViewInit(): Promise<void> {
    await this.refresh();
  }

  protected processData(raw: RawData): void {
    this.rows = raw.geekgames.games.map(rr => {
      return {
      ...rr
      } as Row
    });
    this.rows.sort((g1, g2) => g2.bggRating - g1.bggRating);
  }

  private async refresh() {
    this.geek = this.userService.getAGeek();
    if (this.geek) {
      this.loading = true;
      this.processData(await this.api.retrieve(this.buildQuery()) as RawData);
      this.loading = false;
    }
  }

  protected buildQuery(): string {
    return `{geekgames(selector: "${this.selector}", vars: [{name: "ME", value: "${this.userService.getAGeek()}"}]) {` +
      " games { bggid name playTime bggRating subdomain weight } " +
      " geekGames { bggid shouldPlayScore wantToPlay } " +
      "}}";
  }

  private playersString(min: number, max: number): string {
    if (min === max) {
      return min.toString();
    } else {
      return `${min}-${max}`;
    }
  }
}
