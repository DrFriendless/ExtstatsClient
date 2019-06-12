import { Component } from "@angular/core";
import { DataViewComponent } from "extstats-angular";
import { ym } from "../library"
import { Column } from "extstats-datatable/lib/src/DataTable";
import { buildTooltip, PlayAndGamesIndex } from "../play-index"

@Component({
  selector: "plays-by-year",
  templateUrl: "./plays-by-year.component.html",
})
export class PlaysByYearComponent extends DataViewComponent<PlayAndGamesIndex> {
  public rows: PlaysByYearRow[] = [];
  public columns: Column<PlaysByYearRow>[] = [
    new Column({ field: "year", name: "Year" }),
    new Column({ field: "plays", name: "Plays", tooltip: "Number of plays this year" }),
    new Column({ field: "distinct", name: "Distinct", tooltip: "Number of different games played" }),
    new Column({ field: "dates", name: "Dates", tooltip: "Dates played on" }),
    new Column({ field: "new", name: "New Games", tooltip: "Number of new (ever) games played",
      valueTooltip: (r: PlaysByYearRow) => r.newTooltip }),
    new Column({ field: "nickel", name: "Nickel", tooltip: "Number of games played 5 times or more (ever)",
      valueTooltip: (r: PlaysByYearRow) => r.nickelTooltip }),
    new Column({ field: "dime", name: "Dime", tooltip: "Number of games played 10 times or more (ever)",
      valueTooltip: (r: PlaysByYearRow) => r.dimeTooltip }),
    new Column({ field: "quarter", name: "Quarter", tooltip: "Number of games played 25 times or more (ever)",
      valueTooltip: (r: PlaysByYearRow) => r.quarterTooltip }),
    new Column({ field: "dollar", name: "Dollar", tooltip: "Number of games played 100 times or more (ever)",
      valueTooltip: (r: PlaysByYearRow) => r.dollarTooltip })
  ];

  protected processData(pg: PlayAndGamesIndex): void {
    const rows = []
    pg.years.forEach(y => {
      const totals = pg.everPlayIndex.getTotalPlays(y);
      const nd = pg.everPlayIndex.getEverNickelAndDimes(y);
      let dates = 0;
      let m = 1;
      while (m <= 12) {
        dates += pg.datesIndex[ym({year: y, month: m++})] || 0;
      }
      rows.push({
        year: y, plays: totals.count, distinct: totals.distinct,
        new: totals.new.size, newTooltip: buildTooltip(pg.gamesIndex, totals.new),
        nickel: nd.nickel.size, dime: nd.dime.size, quarter: nd.quarter.size, dollar: nd.dollar.size,
        nickelTooltip: buildTooltip(pg.gamesIndex, nd.nickel), dimeTooltip: buildTooltip(pg.gamesIndex, nd.dime),
        quarterTooltip: buildTooltip(pg.gamesIndex, nd.quarter), dollarTooltip: buildTooltip(pg.gamesIndex, nd.dollar),
        dates
      })
    })
    this.rows = rows;
  }
}

class PlaysByYearRow {
  year: number
  plays: number
  distinct: number
  new: number
  newTooltip: string
  nickel: number
  dime: number
  quarter: number
  dollar: number
  nickelTooltip: string
  dimeTooltip: string
  quarterTooltip: string
  dollarTooltip: string
  dates: number
}
