import {Component, EventEmitter, OnInit} from '@angular/core';
import {PlaysViewComponent} from "extstats-angular";
import {GameData, GeekGameData, PlayData, PlaysData, Result} from "../app.component";
import {makeIndex} from "extstats-core";
import {Column} from "extstats-datatable";
import {Options} from "ng5-slider";
import {debounceTime} from "rxjs/operators";

interface Row {
  rank: number;
  date: string;
  score: number;
  playstr: string;
}

function renderPlays(plays: PlayData[], gi: { [bggid: string]: GameData }): string {
  const strs = plays.map((pd: PlayData) => {
    if (pd.quantity === 1) {
      return "a play of " + gi[pd.game].name;
    } else {
      return `${pd.quantity} plays of ${gi[pd.game].name}`;
    }
  });
  return strs.join(", ");
}

@Component({
  selector: 'best-days',
  templateUrl: './best-days.component.html'
})
export class BestDaysComponent extends PlaysViewComponent<Result> implements OnInit {
  rows: Row[] = [];
  columns: Column<Row>[] = [
    new Column({ field: "rank", name: "Rank", tooltip: "Position in ranking." }),
    new Column({ field: "date", name: "Date", tooltip: "The date of these plays." }),
    new Column({ field: "score", name: "Score", tooltip: "The score for this date." }),
    new Column({ field: "playstr", name: "Plays", tooltip: "Games played with quantities." }),
  ];
  mediumRating = 5.0;
  bias = 1.75;
  maxPlays = 1.5;
  readonly playsSteps = [{ value: 1 }, { value: 1.5 }, { value: 2 }, { value: 2.5 }, { value: 3 }, { value: 4 }, { value: 5 },
    { value: 10 }, { value: 100 } ];
  readonly mediumRatingOptions: Options = { floor: 1, ceil: 10, step: 0.5, showTicks: true, showTicksValues: true };
  readonly biasOptions: Options = { floor: 0.5, ceil: 5.0, step: 0.25, showTicks: true, showTicksValues: true };
  readonly maxPlaysOptions: Options = { floor: 1, ceil: 100, stepsArray: this.playsSteps, showTicks: true, showTicksValues: true };
  readonly fiddle = new EventEmitter<any>();

  private data: PlaysData;
  private gi: { [bggid: string]: GameData } = {};
  private ggi: { [bggid: string]: GeekGameData } = {};

  ngOnInit(): void {
    this.fiddle.subscribe(junk => {
      this.recalc();
    });
  }

  protected processData(d: Result): any {
    if (!d || !d.plays || !d.plays.games || !d.plays.plays) return;
    this.data = d.plays;
    this.gi = makeIndex(this.data.games);
    this.ggi = makeIndex(this.data.geekgames);
    this.fiddle.next();
  }

  private recalc() {
    const byYmd: { [ymd: string]: PlayData[] } = {};
    for (const play of this.data.plays) {
      const ymd = play.year * 10000 + play.month * 100 + play.day;
      const forYmd = byYmd[ymd] || [];
      forYmd.push(play);
      byYmd[ymd] = forYmd;
    }
    const scored: { ymd: string, score: number, plays: PlayData[] }[] = [];
    for (const ymd in byYmd) {
      const score = this.evaluate(byYmd[ymd]);
      scored.push({ymd, score, plays: byYmd[ymd] });
    }
    scored.sort((a, b) => b.score - a.score);
    this.rows = scored.map((row, index) => {
      const ymd = parseInt(row.ymd);
      const date = `${Math.floor(ymd/10000)}-${Math.floor(ymd/100) % 100}-${ymd%100}`;
      return { rank: index+1 , score: Math.floor(row.score*10)/10, date,
        playstr: renderPlays(row.plays, this.gi) };
    });
  }

  private evaluate(plays: PlayData[]): number {
    let score = 0;
    for (const play of plays) {
      const q = play.quantity > this.maxPlays ? this.maxPlays : play.quantity;
      if (!this.ggi[play.game]) continue;
      const rating = this.ggi[play.game].rating;
      if (!rating || rating < 0) continue;
      const sign = Math.sign(rating - this.mediumRating);
      const s = q * Math.pow(Math.abs(rating - this.mediumRating), this.bias);
      score += sign * s;
    }
    return score;
  }
}
