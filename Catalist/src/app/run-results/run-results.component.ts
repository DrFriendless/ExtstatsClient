import {
  Component, TemplateRef, ViewChild
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

interface Row {
  bggid: number;
  name: string;
}

@Component({
  selector: 'run-results',
  imports: [
    FormsModule,
    BoardGameLinkComponent,
    DataTable,
    DataTableBody,
    DataTableController,
    DataTableHead,
  ],
  templateUrl: './run-results.component.html'
})
export class RunResultsComponent {
  @ViewChild('boardgame') boardgame!: TemplateRef<RowContext<Row>>;
  private params: ColumnParams<Row>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The selected game",
      classname: "col-game-name",
      template: this.boardgame
    }
  ];
  columns: Column<Row>[] = [];
  rows: Row[] = [];

  constructor(public tagService: UserTagService) {
  }

  setData(rows: Row[]) {
    this.rows = rows;
  }

  public ngAfterViewInit() {
    this.params[0].template = this.boardgame;
    this.columns = this.params.map(c => new Column<Row>(c));
  }
}
