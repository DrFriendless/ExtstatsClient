import { Component } from '@angular/core';
import { PlaysViewComponent } from "extstats-angular"
import { stddev } from "../library"
import {Result} from "../app.component";

@Component({
  selector: 'temporal-by-day',
  templateUrl: './temporal-by-day.component.html'
})
export class TemporalByDayComponent extends PlaysViewComponent<Result> {
  public years: number[] = [];
  public byYear: Record<number, number[]> = {};
  public totals = [0, 0, 0, 0, 0, 0, 0, 0];
  public styles: Record<number, string[]> = {};
  public totalStyles = [ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined ];

  protected processData(d: Result) {
    if (!d || !d.plays || !d.plays.games || !d.plays.geeks) return;
    const data = d.plays;
    const plays = data.plays;
    for (const play of plays) {
      if (play.year < 2005) continue;
      if (this.years.indexOf(play.year) < 0) {
        this.years.push(play.year);
        this.byYear[play.year] = [0, 0, 0, 0, 0, 0, 0, 0];
        this.styles[play.year] = [ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined ];
      }
      const y = this.byYear[play.year];
      y[0] += play.quantity;
      const date = new Date(play.year, play.month - 1, play.day);
      y[date.getDay() + 1] += play.quantity;
      this.totals[0] += play.quantity;
      this.totals[date.getDay() + 1] += play.quantity;
    }
    const daysVals = [];
    for (const y of Object.values(this.byYear)) {
      for (const i in y) {
        if (parseInt(i) > 0) daysVals.push(y[i]);
      }
    }
    const yearVals = Object.values(this.byYear).map(y => y[0]);
    const daysSD = stddev(daysVals);
    const yearsSD = stddev(yearVals);
    const totalsSD = stddev(this.totals.slice(1));
    for (const i in this.totals) {
      if (parseInt(i) === 0) {
        this.totalStyles[i] = "class0";
      } else {
        this.totalStyles[i] = totalsSD.allocate(this.totals[i]);
      }
    }
    for (const y in this.byYear) {
      for (const i in this.byYear[y]) {
        if (parseInt(i) === 0) {
          this.styles[y][0] = yearsSD.allocate(this.byYear[y][i]);
        } else {
          this.styles[y][i] = daysSD.allocate(this.byYear[y][i]);
        }
      }
    }
    this.years.sort();
  }
}
