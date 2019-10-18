import { Component } from '@angular/core';
import { CollectionWithPlays, GameData, GamePlays, makeGamesIndex, makePlaysIndex } from "extstats-core"
import { DataViewComponent } from "extstats-angular";

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
export class PogoTableComponent<C extends CollectionWithPlays> extends DataViewComponent<C> {
  public rows: PogoTableRow[] = [];

  protected processData(data: C): any {
    if (!data || !data.collection) return;
    const gamesIndex: Record<number, GameData> = makeGamesIndex(data.games);
    const playsIndex: Record<number, GamePlays> = makePlaysIndex(data.plays);
    const lyPlaysIndex: Record<number, GamePlays> = makePlaysIndex(data.lastYearPlays);
    const rows: PogoTableRow[] = [];
    data.collection.forEach(gg => {
      const game = gamesIndex[gg.bggid];
      const plays: { plays: number, lastPlay?: number, firstPlay?: number } = playsIndex[gg.bggid] || { plays: 0 };
      const lyPlays: { plays: number } = lyPlaysIndex[gg.bggid] || { plays: 0 };
      const bggRating = Math.floor(game.bggRating * 100) / 100;
      const cdf = this.cdf(plays.plays);
      const utilisation = Math.round(cdf * 10000) / 100;
      const row: PogoTableRow = {
        name: game.name, plays: plays.plays, bggRank: game.bggRanking, bggRating,
        rating: gg.rating < 0 ? "" : gg.rating.toString(), bggid: gg.bggid,
        lastPlay: formatDate(plays.lastPlay), firstPlay: formatDate(plays.firstPlay),
        playsInLastYear: lyPlays.plays, utilisation
      };
      rows.push(row);
    });
    rows.sort((g1, g2) => g2.plays - g1.plays);
    this.rows = rows;
  }

  // exponential distribution cumulative distribution function
  private cdf(n: number): number {
    return 1.0 - Math.exp(-LAMBDA * n);
  }
}

function formatDate(date: number | undefined): string {
  if (!date) return "";
  const y = Math.floor(date / 10000);
  const m = Math.floor(date / 100) % 100;
  const d = date % 100;
  return `${y}-${m}-${d}`;
}

