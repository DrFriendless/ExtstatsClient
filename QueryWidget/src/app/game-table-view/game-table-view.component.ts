import {
  AfterViewInit,
  Component,
  Signal,
  signal,
  TemplateRef,
  viewChild,
  WritableSignal
} from "@angular/core";
import {BoardGameLinkComponent, LoaderComponent, UserTagService} from "extstats-angular";
import {GameTableRow} from "./game-table-view";
import {ViewComponent} from "../view-mode";
import {
  Column,
  ColumnParams,
  DataTable,
  DataTableBody,
  DataTableController,
  DataTableHead,
  RowContext
} from "extstats-datatable";

@Component({
  selector: 'game-view',
  templateUrl: './game-table-view.component.html',
  imports: [
    LoaderComponent,
    DataTableController,
    DataTable,
    DataTableHead,
    BoardGameLinkComponent,
    DataTableBody
  ]
})
export class GameTableViewComponent implements AfterViewInit, ViewComponent {
  loading = signal<boolean>(false);
  boardgame: Signal<TemplateRef<any> | undefined> = viewChild('boardgame');
  data = signal<GameTableRow[]>([]);
  private columnParams: ColumnParams<GameTableRow>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The game you want in trade",
      template: this.boardgame as unknown as TemplateRef<RowContext<GameTableRow>>,
      classname: "col-game-name"
    },
    { field: "bggRanking", name: "BGG Ranking", tooltip: "Ranking of this game on BoardGameGeek", classname: "col-ranking",
      valueHtml: (r: GameTableRow) => r.bggRanking.toString()
    },
    { field: "bggRating", name: "BGG Rating", tooltip: "Rating of this game on BoardGameGeek", classname: "col-rating",
      valueHtml: (r: GameTableRow) => r.bggRating.toString()
    },
    { field: "yearPublished", name: "Year Published", tooltip: "Year this game was first published", classname: "col-year" },
    { field: "playerCount", name: "Players", tooltip: "How many players can play this game", classname: "col-number" },
    { field: "weight", name: "Weight", tooltip: "BGG weight for this game", classname: "col-number" }
  ];
  columns: WritableSignal<Column<any>[]> = signal([]);

  constructor(public tagService: UserTagService) {
  }

  public ngAfterViewInit() {
    this.columnParams[0].template = this.boardgame()! as TemplateRef<RowContext<GameTableRow>>;
    this.columns.set(this.columnParams.map(c => new Column<GameTableRow>(c)));
  }

  setData(data: GameTableRow[]): void {
    data.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    this.data.set(data);
  }

  setLoading(loading: boolean): void {
    this.loading.set(loading);
  }
}
