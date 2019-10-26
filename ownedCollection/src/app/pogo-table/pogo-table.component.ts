import { Component } from '@angular/core';
import { makeIndex } from "extstats-core"
import { DataViewComponent } from "extstats-angular";
import {Result} from "../app.component";

type PogoTableRow = {
  bggid: number;
  name: string;
  plays: number;
  bggRank: number;
  bggRating: number;
  rating: string;
  lastPlay: string;
  firstPlay: string;
  playsInLastYear: number;
  utilisation: number;
};
const LAMBDA = Math.log(0.1) / -10.0;

@Component({
  selector: 'extstats-pogo-table',
  templateUrl: './pogo-table.component.html'
})
export class PogoTableComponent extends DataViewComponent<Result> {
  public rows: PogoTableRow[] = [];

  protected processData(data: Result): any {
    if (!data || !data.geekgames) return;
    const gamesIndex = makeIndex(data.geekgames.games);
    const rows: PogoTableRow[] = [];
    data.geekgames.geekGames.forEach(gg => {
      const game = gamesIndex[gg.bggid];
      const bggRating = Math.floor(game.bggRating * 100) / 100;
      const plays = gg.plays;
      const cdf = cdfunction(plays);
      const utilisation = Math.round(cdf * 10000) / 100;
      const row: PogoTableRow = {
        name: game.name, plays, bggRank: game.bggRanking, bggRating,
        rating: gg.rating < 0 ? "" : gg.rating.toString(), bggid: gg.bggid,
        lastPlay: formatDate(gg.lastPlay), firstPlay: formatDate(gg.firstPlay),
        playsInLastYear: gg.lyPlays, utilisation
      };
      rows.push(row);
    });
    rows.sort((g1, g2) => g2.plays - g1.plays);
    this.rows = rows;
  }
}

// exponential distribution cumulative distribution function
function cdfunction(n: number): number {
  return 1.0 - Math.exp(-LAMBDA * n);
}

function formatDate(date: number | undefined): string {
  if (!date) return "";
  const y = Math.floor(date / 10000);
  const m = Math.floor(date / 100) % 100;
  const d = date % 100;
  return `${y}-${m}-${d}`;
}

