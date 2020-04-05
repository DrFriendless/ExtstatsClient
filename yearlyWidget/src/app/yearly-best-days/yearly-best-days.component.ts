import { Component } from '@angular/core';
import {PlaysViewComponent} from "extstats-angular";
import {Result} from "../app.component";
import {makeIndex} from "extstats-core";
import {ymdToDate} from "../library";

interface PlayDesc {
  quantity: number;
  game: string;
  bggid: number;
}
interface DateRecord {
  plays: Coalesced[];
  score: number;
  playDescs: PlayDesc[];
}

interface Row {
  ymd: Date;
  score: number;
  playDescs: PlayDesc[];
}
interface Coalesced {
  bggid: number;
  quantity: number;
  game: string;
  rating: number;
}

@Component({
  selector: 'yearly-best-days',
  templateUrl: './yearly-best-days.component.html',
  styleUrls: ['./yearly-best-days.component.scss']
})
export class YearlyBestDaysComponent extends PlaysViewComponent<Result> {
  rows: Row[] = [];

  private static merge(bggid: number, quantity: number, game: string, rating: number, into: Coalesced[]) {
    for (const c of into) {
      if (c.bggid === bggid) {
        c.quantity += quantity;
        return;
      }
    }
    into.push({ bggid, quantity, game, rating });
  }

  protected processData(data: Result): any {
    if (!data || !data.plays || !data.plays.geeks || !data.plays.geeks.length) return;
    const gamesIndex = makeIndex(data.plays.games);
    const ggIndex = makeIndex(data.plays.geekgames);

    const byDate: Record<number, DateRecord> = {};
    for (const p of data.plays.plays) {
      const game = gamesIndex[p.game];
      if (game.isExpansion) continue;
      const gg = ggIndex[p.game];
      if (!byDate[p.ymd]) byDate[p.ymd] = { plays: [], score: 0, playDescs: [] };
      YearlyBestDaysComponent.merge(p.game, p.quantity, game.name, gg ? gg.rating : 0, byDate[p.ymd].plays);
    }

    for (const dr of Object.values(byDate)) {
      for (const p of dr.plays) {
        const desc: PlayDesc = { bggid: p.bggid, game: p.game, quantity: p.quantity };
        dr.playDescs.push(desc);
        if (p.rating < 1) continue;
        const scorer = p.rating - 5.0;
        const scoreq = (p.quantity > 1) ? 1.5 : p.quantity;
        const magnitude = scoreq * Math.pow(Math.abs(scorer), 1.75);
        const score = Math.sign(scorer) * magnitude;
        dr.score += score;
      }
    }
    let rows = [];
    for (const ymd in byDate) {
      const date = byDate[ymd];
      const r: Row = { ymd: ymdToDate(ymd), score: date.score, playDescs: date.playDescs };
      rows.push(r);
    }
    rows.sort((ra, rb) => rb.score - ra.score);
    if (rows.length > 20) rows = rows.slice(0, 20);
    this.rows = rows;
  }
}
