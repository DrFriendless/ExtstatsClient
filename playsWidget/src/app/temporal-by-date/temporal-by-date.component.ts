import { Component } from '@angular/core';
import { PlaysViewComponent } from "extstats-angular"
import { makeGamesIndex, MultiGeekPlays } from "extstats-core"
import { monthLengths, months, stddev } from "../library"

@Component({
  selector: 'temporal-by-date',
  templateUrl: './temporal-by-date.component.html'
})
export class TemporalByDateComponent extends PlaysViewComponent<MultiGeekPlays> {
  public rows: Row[] = [];

  constructor() {
    super();
    for (const i in months) {
      this.rows.push(new Row(months[i], monthLengths[i]));
    }
  }

  protected processData(data: MultiGeekPlays) {
    if (!data || !data.games || !data.geeks || !data.geeks.length) return;
    const totalRow = this.rows[12];
    const geek = data.geeks[0];
    const plays = data.plays[geek];
    const gameIndex = makeGamesIndex(data.games);
    for (const play of plays) {
      play['name'] = gameIndex[play.game].name;
      if (play.date === 2 && play.month === 1) console.log(play);
      const month = this.rows[play.month - 1];
      month.days[play.date - 1] += play.quantity;
      totalRow.days[play.date - 1] += play.quantity;
      month.total += play.quantity;
      totalRow.total += play.quantity;
    }
    const monthTotals = this.rows.slice(0, this.rows.length - 1).map(r => r.total);
    const dateTotals = totalRow.days;
    const allValues = [];
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
  public style: string[] = [];
  public total: number = 0;
  public totalStyle: string;

  constructor(public name: string, public length: number) {
    for (let i=0; i<length; i++) {
      this.indexes.push(i);
      this.days.push(0);
      this.style.push(undefined);
    }
  }
}
