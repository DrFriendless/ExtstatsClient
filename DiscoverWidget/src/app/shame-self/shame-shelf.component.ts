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
import {makeIndex} from "extstats-core";

interface Row extends TaggedGame {
  bggRating: number;
  weight: number;
  playTime: number;
  subdomain: string;
  wantToPlay: boolean;
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
    LoaderComponent,
    BoardGameLinkComponent
  ],
  templateUrl: './shame-shelf.component.html'
})
export class ShameShelfComponent implements AfterViewInit {
  @ViewChild('boardgame') boardgame!: TemplateRef<RowContext<Row>>;
  private static DEFAULT_SELECTOR = "minus(owned(ME),played(ME),expansions(),books())";
  private readonly selector = ShameShelfComponent.DEFAULT_SELECTOR;

  private params: ColumnParams<Row>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The game of shame",
      template: this.boardgame,
      classname: "col-game-name"
    },
    { field: "bggRating", name: "BGG Rating", tooltip: "Rating of this game on BoardGameGeek", classname: "col-rating",
      valueHtml: (r: Row) => (!r.bggRating) ? "" : ((Math.floor(r.bggRating * 10))/10).toString()
    },
    { field: "weight", name: "BGG Weight", tooltip: "Weight of this game as assessed by BGG", classname: "col-number",
      valueHtml: (r: Row) => (!r.weight) ? "" : ((Math.floor(r.weight * 10))/10).toString()
    },
    { field: "subdomain", name: "Subdomain", tooltip: "BGG Subdomain", classname: "col-subdomain" },
    {
      field: "wantToPlay", name: "Want to Play", tooltip: "Want to play", classname: "col-boolean",
      valueHtml: (r: Row) => r.wantToPlay ? "✓" : ""
    }
  ];
  columns = this.params.map(c => new Column<Row>(c));
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

  protected processData(raw: RawData): void {
    const index: Record<string, { bggid: number; wantToPlay: boolean }> = makeIndex(raw.geekgames.geekGames);
    this.rows = raw.geekgames.games.map(rr => {
      return {
        ...rr,
        ...(index[rr.bggid.toString()] || {})
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
      " geekGames { bggid wantToPlay tags } " +
      "}}";
  }
}
