import { Component } from '@angular/core';
import { PlaysViewComponent } from "extstats-angular"
import { months, stddev } from "../library"
import {Result} from "../app.component";

@Component({
  selector: 'temporal-by-month',
  templateUrl: './temporal-by-month.component.html'
})
export class TemporalByMonthComponent extends PlaysViewComponent<Result> {
  public rows: Row[] = [];
  public monthNames = months.slice(0, months.length - 1);
  private byYear: Record<number, Row> = {};

  protected processData(d: Result) {
    if (!d || !d.plays || !d.plays.games || !d.plays.geeks) return;
    const data = d.plays;
    const totalRow = new Row("Total");
    const plays = data.plays;
    for (const play of plays) {
      if (play.year < 2005) continue;
      const yearRow = this.byYear[play.year] || new Row(play.year.toString());
      this.byYear[play.year] = yearRow;
      yearRow.total += play.quantity;
      yearRow.months[play.month - 1] += play.quantity;
      totalRow.total += play.quantity;
      totalRow.months[play.month - 1] += play.quantity;
    }
    const yearTotals = Object.values(this.byYear).map(r => r.total);
    const monthTotals = totalRow.months;
    const allValues = [];
    Object.values(this.byYear).map(row => allValues.push(...row.months));
    const monthSD = stddev(monthTotals);
    const yearsSD = stddev(yearTotals);
    const valuesSD = stddev(allValues);
    for (let i in totalRow.months) totalRow.style[i] = monthSD.allocate(totalRow.months[i]);
    for (const row of Object.values(this.byYear)) {
      row.totalStyle = yearsSD.allocate(row.total);
      for (let i in row.months) row.style[i] = valuesSD.allocate(row.months[i]);
    }
    const rs = Object.values(this.byYear);
    rs.sort(cmp);
    rs.push(totalRow);
    this.rows = rs;
  }
}

function cmp(r1: Row, r2: Row): number {
  if (r1.name < r2.name) return -1;
  if (r1.name < r1.name) return 1;
  return 0;
}

class Row {
  public indexes: number[] = [];
  public months: number[] = [];
  public style: string[] = [];
  public total: number = 0;
  public totalStyle: string;

  constructor(public name: string) {
    for (let i=0; i<12; i++) {
      this.indexes.push(i);
      this.months.push(0);
      this.style.push(undefined);
    }
  }
}
