import { Component } from '@angular/core';
import { PlaysViewComponent } from "extstats-angular"
import { makeIndex} from "extstats-core"
import { monthLengths, months, stddev } from "../library"
import {Result} from "../app.component";
import {LoginService} from "../login.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'temporal-by-date',
  templateUrl: './temporal-by-date.component.html',
  standalone: true,
  imports: [
    NgClass
  ]
})
export class TemporalByDateComponent extends PlaysViewComponent<Result> {
  public rows: Row[] = [];

  constructor(loginService: LoginService) {
    super();
    for (const i in months) {
      this.rows.push(new Row(months[i], monthLengths[i]));
    }
    loginService.registerFeature("temporalbydate");
  }

  protected processData(d: Result) {
    if (!d || !d.plays || !d.plays.games || !d.plays.plays) return;
    const data = d.plays;
    const totalRow = this.rows[12];
    const plays = data.plays;
    const gameIndex = makeIndex(data.games);
    for (const play of plays) {
      play['name'] = gameIndex[play.game].name;
      if (play.month === 0) continue;
      const month = this.rows[play.month - 1];
      month.days[play.day - 1] += play.quantity;
      totalRow.days[play.day - 1] += play.quantity;
      month.total += play.quantity;
      totalRow.total += play.quantity;
    }
    const monthTotals = this.rows.slice(0, this.rows.length - 1).map(r => r.total);
    const dateTotals = totalRow.days;
    const allValues: number[] = [];
    this.rows.slice(0, this.rows.length - 1).forEach(row => allValues.push(...row.days));
    const monthSD = stddev(monthTotals);
    const totalsSD = stddev(dateTotals);
    const valuesSD = stddev(allValues);
    for (const row of this.rows) {
      if (row === totalRow) {
        for (let i in row.days) row.style[i] = totalsSD.allocate(row.days[i]);
      } else {
        row.totalStyle = monthSD.allocate(row.total);
        for (let i in row.days) row.style[i] = valuesSD.allocate(row.days[i]);
      }
    }
  }
}

class Row {
  public indexes: number[] = [];
  public days: number[] = [];
  public style: (string | undefined)[] = [];
  public total: number = 0;
  public totalStyle: string | undefined;

  constructor(public name: string, public length: number) {
    for (let i=0; i<length; i++) {
      this.indexes.push(i);
      this.days.push(0);
      this.style.push(undefined);
    }
  }
}
