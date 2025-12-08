import { Component } from '@angular/core';
import { makeIndex} from "extstats-core"
import {DataViewComponent} from "extstats-angular";
import {Data} from "../app.component";
import {
  Column,
  ColumnParams,
  DataTable,
  DataTableBody,
  DataTableController,
  DataTableHead,
} from "extstats-datatable";

type FaveYearRow = { year: number, games: string[], summary: string; }

@Component({
  selector: 'faves-by-year-table',
  imports: [
    DataTableController,
    DataTableBody,
    DataTableHead,
    DataTable,
    DataTableBody,
    DataTableHead
  ],
  templateUrl: './faves-by-year-table.component.html'
})
export class FavesByYearTableComponent extends DataViewComponent<Data> {
  private params: ColumnParams<FaveYearRow>[] = [
    { field: "year", name: "Year", tooltip: "Year These Games Were Published" },
    { field: "summary", name: "Games", tooltip: "Games You Rate 8+" }
  ];
  columns = this.params.map(c => new Column<FaveYearRow>(c));
  rows: FaveYearRow[] = [];

  protected processData(data: Data): any {
    this.rows = [];
    const byYear: Record<number, FaveYearRow> = {};
    const index = makeIndex(data.games);
    for (let gg of data.geekGames) {
      if (gg.rating >= 8) {
        const game = index[gg.bggid];
        let row = byYear[game.yearPublished];
        if (!row) {
          byYear[game.yearPublished] = { year: game.yearPublished, games: [game.name], summary: game.name };
          this.rows.push(byYear[game.yearPublished]);
          this.rows.sort((y1,y2) => y1.year - y2.year);
        } else {
          row.games.push(game.name);
          row.summary = this.join(row.games);
        }
      }
    }
  }

  join(ss: string[]): string {
    return ss.join(", ");
  }
}
