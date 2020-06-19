import { Component } from '@angular/core';
import { PlaysViewComponent} from "extstats-angular";
import {
  buildTooltip,
  GameID,
  PlayAndGamesIndex
} from "../play-index";

interface Month {
  plays: number;
  distinct: number;
  distincttip: string;
  new: number;
  newtip: string;
  year: number;
  month: string;
  tooltip: string;
}

@Component({
  selector: 'monthly-skyline',
  templateUrl: './monthly-skyline.component.html'
})
export class MonthlySkylineComponent extends PlaysViewComponent<PlayAndGamesIndex> {
  months: Month[] = [];
  max: number;
  height = 200;

  protected processData(data: PlayAndGamesIndex): void {
    this.months = [];
    this.max = 0;
    const everPlayed: Set<GameID> = new Set();
    for (const ym of data.months || []) {
      const totalPlays = data.everPlayIndex.getTotalPlays(ym);
      const year = Math.floor(ym/100);
      const date = new Date(year, ym % 100 - 1, 1);
      this.months.push({
        plays: totalPlays.count,
        distinct: totalPlays.distinct,
        new: totalPlays.new.size,
        newtip: buildTooltip(data.gamesIndex, totalPlays.new),
        distincttip: buildTooltip(data.gamesIndex, totalPlays.played),
        year: year,
        month: date.toLocaleString('default', { month: 'short' }),
        tooltip: `${date.toLocaleString('default', { month: 'long' })} ${year} - ${totalPlays.count} plays, ${totalPlays.distinct} different games, ${totalPlays.new.size} new games`
      });
      if (totalPlays.count > this.max) this.max = totalPlays.count;
    }
  }
}


