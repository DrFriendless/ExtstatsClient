import {Component, TemplateRef, ViewChild} from '@angular/core';
import { makeIndex } from "extstats-core";
import {BoardGameLinkComponent, DataViewComponent, TaggedGame, UserTagService} from "extstats-angular";
import {Data, formatDate, ymdToDate} from "../app.component";
import {
  Column,
  ColumnParams,
  DataTable,
  DataTableBody,
  DataTableController,
  DataTableHead,
  RowContext
} from "extstats-datatable";

interface LeastLovedRow extends TaggedGame {
    rating: number;
    lastPlayed: string;
    leastLovedScore: number;
    daysSince: number;
    forTrade: boolean;
    plays: number;
}

@Component({
  selector: 'least-loved',
  imports: [
    DataTableController,
    DataTable,
    DataTableHead,
    DataTableBody,
    BoardGameLinkComponent
  ],
  templateUrl: './least-loved.component.html'
})
export class LeastLovedComponent extends DataViewComponent<Data> {
  @ViewChild('boardgame') boardgame!: TemplateRef<RowContext<LeastLovedRow>>;
  public params: ColumnParams<LeastLovedRow>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The game you don't really love",
      classname: "col-game-name",
      template: this.boardgame
    },
    { field: "rating", name: "Your Rating", tooltip: "Your rating for this game.", classname: "col-rating" },
    { field: "lastPlayed", name: "Last Played", tooltip: "Last date you played this game.", classname: "col-date" },
    { field: "daysSince", name: "Days Since Last Play", tooltip: "Days since you last played this game.", classname: "col-days-since" },
    { field: "plays", name: "Plays", tooltip: "Times you have ever played this game.", classname: "col-plays" },
    { field: "forTrade", name: "For Trade", classname: "col-boolean",
      valueHtml: (r: LeastLovedRow) => r.forTrade ? "✓" : ""
    }
  ];
  columns: Column<LeastLovedRow>[] = [];

  constructor(public tagService: UserTagService) {
    super();
  }

  public override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.params[0].template = this.boardgame;
    this.columns = this.params.map(c => new Column<LeastLovedRow>(c));
  }

  public rows: LeastLovedRow[] = [];

  protected processData(data: Data): any {
    if (!data || !data.geekGames) return;
    const now = new Date();
    const gamesIndex = makeIndex(data.games);
    const rows: LeastLovedRow[] = [];
    data.geekGames.forEach(gg => {
      if (gg.rating > 0 && gg.lastPlay) {
        const game = gamesIndex[gg.bggid];
        const lp = ymdToDate(gg.lastPlay);
        const daysSince = Math.round((now.valueOf() - lp.valueOf()) / 86400000);
        const ll = daysSince / gg.rating / gg.rating;
        const row: LeastLovedRow = {
          name: game.name,
          tags: gg.tags,
          bggid: gg.bggid,
          rating: gg.rating,
          lastPlayed: formatDate(gg.lastPlay),
          daysSince: daysSince,
          leastLovedScore: ll,
          forTrade: gg.forTrade,
          plays: gg.plays
        };
        rows.push(row);
      }
    });
    rows.sort((a, b) => {
      return b.leastLovedScore - a.leastLovedScore
    });
    this.rows = (rows.length > 30) ? rows.slice(0, 30) : rows
  }
}
