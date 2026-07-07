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
import {GeekGameResult, GeekGamesResult} from "./geekgame-table-view";
import {
  Column,
  ColumnParams,
  DataTable,
  DataTableBody,
  DataTableController,
  DataTableHead,
  RowContext
} from "extstats-datatable";
import {ViewComponent} from "../view-mode";

@Component({
  selector: 'geekgame-view',
  templateUrl: './geekgame-table-view.component.html',
  imports: [
    LoaderComponent,
    DataTable,
    DataTableBody,
    BoardGameLinkComponent,
    DataTableController,
    DataTableHead,
  ]
})
export class GeekGameTableViewComponent implements AfterViewInit, ViewComponent {
  loading = signal<boolean>(false);
  boardgame: Signal<TemplateRef<any> | undefined> = viewChild('boardgame');
  data = signal<GeekGameResult[]>([]);
  private columnParams: ColumnParams<GeekGameResult>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The name of the gam,e",
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
    },
    {
      field: "forTrade", name: "For Trade", tooltip: "For trade", classname: "col-boolean",
      valueHtml: (r: GeekGameResult) => r.forTrade ? "✓" : ""
    }
  ];
  columns: WritableSignal<Column<any>[]> = signal([]);

  constructor(public tagService: UserTagService) {
  }

  public ngAfterViewInit() {
    this.columnParams[0].template = this.boardgame()! as TemplateRef<RowContext<GeekGameResult>>;
    this.columns.set(this.columnParams.map(c => new Column<GeekGameResult>(c)));
  }

  setData(data: GeekGamesResult): void {
    data.geekgames.geekGames.sort((a,b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    this.data.set(data.geekgames.geekGames);
  }

  setLoading(loading: boolean): void {
    this.loading.set(loading);
  }
}
