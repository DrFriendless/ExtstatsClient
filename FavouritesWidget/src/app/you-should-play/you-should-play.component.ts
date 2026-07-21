import {Component, TemplateRef, ViewChild} from "@angular/core";
import {BoardGameLinkComponent, DataViewComponent, UserTagService} from "extstats-angular";
import { Data, Result } from "../app.component";
import {Column, ColumnParams, DataTable, DataTableBody, DataTableHead, RowContext} from "extstats-datatable";
import {toDateString} from "../library";
import {makeIndex} from "extstats-core";

@Component({
  selector: 'you-should-play',
  imports: [
    DataTable,
    DataTableHead,
    DataTableBody,
    BoardGameLinkComponent
  ],
  templateUrl: './you-should-play.component.html'
})
export class YouShouldPlayComponent extends DataViewComponent<Result> {
  @ViewChild('boardgame') boardgame!: TemplateRef<RowContext<Row>>;

  params: ColumnParams<Row>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The game you should play",
      classname: "col-game-name",
      template: this.boardgame
    },
    { field: "rating", name: "Rating", tooltip: "Your rating for this game.", classname: "col-rating" },
    { field: "plays", name: "Plays", tooltip: "The number of times you have played this game.", classname: "col-number" },
    { field: "lastPlayed", name: "Last Played", tooltip: "Last date you played this game.", classname: "col-date" },
    { field: "daysSincePlayed", name: "Days Since Last Play", tooltip: "Days since you last played this game.", classname: "col-number" },
    { field: "wantToPlay", name: "Want to Play", "tooltip": "Whether you have this game marked as want to play on BGG",
    classname: "col-boolean", valueHtml: (r: Row) => r.wantToPlay ? "✓" : "" }
  ];
  columns: Column<Row>[] = [];
  rows: Row[] = [];
  data: Data | undefined;

  constructor(public tagService: UserTagService) {
    super();
  }

  public override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.params[0].template = this.boardgame;
    this.columns = this.params.map(c => new Column<Row>(c));
  }

  protected processData(data: Result) {
    if (!data || !data.geekgames) return;
    this.data = data.geekgames;
    const gamesIndex = makeIndex(this.data.games);
    const rows: Row[] = [];
    this.data.geekGames.forEach(gg => {
      if (gg.rating > 0) {
        const game = gamesIndex[gg.bggid];
        const row: Row = {
          name: game.name,
          bggid: gg.bggid,
          rating: gg.rating,
          plays: gg.plays,
          tags: gg.tags,
          lastPlayed: toDateString(gg.lastPlay),
          shouldPlayScore: gg.shouldPlayScore,
          daysSincePlayed: gg.daysSincePlayed,
          wantToPlay: gg.wantToPlay
        };
        rows.push(row);
      }
    });
    rows.sort((a, b) => {
      return b.shouldPlayScore - a.shouldPlayScore
    });
    this.rows = (rows.length > 20) ? rows.slice(0, 20) : rows
  }
}

interface Row {
  name: string;
  bggid: number;
  tags: string[] | undefined;
  rating: number;
  plays: number;
  lastPlayed: string;
  shouldPlayScore: number;
  daysSincePlayed: number;
  wantToPlay: boolean;
}

