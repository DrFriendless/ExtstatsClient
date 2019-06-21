import { Component } from '@angular/core';
import { PlaysViewComponent } from "extstats-angular"
import { MultiGeekPlays } from "extstats-core"
import { stddev } from "../library"

@Component({
  selector: 'temporal-by-day',
  templateUrl: './temporal-by-day.component.html'
})
export class TemporalByDayComponent extends PlaysViewComponent<MultiGeekPlays> {
  public years: number[] = [];
  public byYear: Record<number, number[]> = {};
  public totals = [0, 0, 0, 0, 0, 0, 0, 0];
  public styles: Record<number, string[]> = {};
  public totalStyles = [ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined ];

  protected processData(data: MultiGeekPlays) {
    if (!data || !data.games || !data.geeks || !data.geeks.length) return;
    const geek = data.geeks[0];
    const plays = data.plays[geek];
    for (const play of plays) {
      if (play.year < 2005) continue;
      if (this.years.indexOf(play.year) < 0) {
        this.years.push(play.year);
        this.byYear[play.year] = [0, 0, 0, 0, 0, 0, 0, 0];
        this.styles[play.year] = [ undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined ];
      }
      const y = this.byYear[play.year];
      y[0] += play.quantity;
      const date = new Date(play.year, play.month - 1, play.date);
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
