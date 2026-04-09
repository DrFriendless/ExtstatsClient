import {
  Component, effect, input, InputSignal, signal, Signal, TemplateRef, viewChild, WritableSignal
} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {BoardGameLinkComponent, UserTagService} from "extstats-angular";
import {
  Column,
  ColumnParams,
  DataTable,
  DataTableBody,
  DataTableController,
  DataTableHead,
  RowContext
} from "extstats-datatable";
import {GameResult, GeekGameResult, QueryMode, Row} from "../app.component";

@Component({
  selector: 'query-results',
  imports: [
    FormsModule,
    BoardGameLinkComponent,
    DataTable,
    DataTableBody,
    DataTableController,
    DataTableHead,
  ],
  templateUrl: './query-results.component.html'
})
export class QueryResultsComponent {
  boardgame: Signal<TemplateRef<any> | undefined> = viewChild('boardgame');
  data: InputSignal<Row[]> = input([] as Row[]);
  mode: InputSignal<QueryMode | undefined> = input();
  private gameParams: ColumnParams<GameResult>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The game you want in trade",
      template: this.boardgame as unknown as TemplateRef<RowContext<GameResult>>,
      classname: "col-game-name"
    },
    { field: "bggRanking", name: "BGG Ranking", tooltip: "Ranking of this game on BoardGameGeek", classname: "col-ranking",
      valueHtml: (r: GameResult) => r.bggRanking.toString()
    },
    { field: "bggRating", name: "BGG Rating", tooltip: "Rating of this game on BoardGameGeek", classname: "col-rating",
      valueHtml: (r: GameResult) => r.bggRating.toString()
    },
    { field: "yearPublished", name: "Year Published", tooltip: "Year this game was first published", classname: "col-year" },
    { field: "playerCount", name: "Players", tooltip: "How many players can play this game", classname: "col-number" },
    { field: "weight", name: "Weight", tooltip: "BGG weight for this game", classname: "col-number" }
  ];
  private geekGameParams: ColumnParams<GeekGameResult>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The game you want in trade",
      template: this.boardgame as unknown as TemplateRef<RowContext<GeekGameResult>>,
      classname: "col-game-name"
    },
    { field: "rating", name: "Rating", tooltip: "Your rating for this game", classname: "col-rating",
      valueHtml: (r: GeekGameResult) => r.rating < 1 ? "" : r.rating.toString()
    },
    {
      field: "owned", name: "Owned", tooltip: "Whether you own this game", classname: "col-boolean",
      valueHtml: (r: GeekGameResult) => r.owned ? "✓" : ""
    },
    {
      field: "wantToBuy", name: "Want to Buy", tooltip: "Want to buy", classname: "col-boolean",
      valueHtml: (r: GeekGameResult) => r.wantToBuy ? "✓" : ""
    },
    {
      field: "wantInTrade", name: "Want in Trade", tooltip: "Want in trade", classname: "col-boolean",
      valueHtml: (r: GeekGameResult) => r.wantInTrade ? "✓" : ""
    },
    {
      field: "wantToPlay", name: "Want to Play", tooltip: "Want to play", classname: "col-boolean",
      valueHtml: (r: GeekGameResult) => r.wantToPlay ? "✓" : ""
    }

  ];
  gameColumns: WritableSignal<Column<GameResult>[]> = signal([]);
  geekGameColumns: WritableSignal<Column<GeekGameResult>[]> = signal([]);
  columns: WritableSignal<Column<any>[]> = signal([]);

  constructor(public tagService: UserTagService) {
    effect(() => {
      if (this.mode() === "games") {
        this.columns.set(this.gameColumns() as Column<any>[]);
      } else {
        this.columns.set(this.geekGameColumns() as Column<any>[]);
      }
    });
  }

  public ngAfterViewInit() {
    this.gameParams[0].template = this.boardgame()! as TemplateRef<RowContext<GameResult>>;
    this.geekGameParams[0].template = this.boardgame()! as TemplateRef<RowContext<GeekGameResult>>;
    this.gameColumns.set(this.gameParams.map(c => new Column<GameResult>(c)));
    this.geekGameColumns.set(this.geekGameParams.map(c => new Column<GeekGameResult>(c)));
  }
}
