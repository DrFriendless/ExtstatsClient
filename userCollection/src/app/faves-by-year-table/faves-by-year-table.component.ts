import { Component } from '@angular/core';
import { makeIndex} from "extstats-core"
import {DataViewComponent} from "extstats-angular";
import {Data} from "../app.component";

type FaveYearRow = { year: number, games: string[]; }

@Component({
  selector: 'faves-by-year-table',
  templateUrl: './faves-by-year-table.component.html'
})
export class FavesByYearTableComponent extends DataViewComponent<Data> {
  public rows: FaveYearRow[] = [];

  protected processData(data: Data): any {
    this.rows = [];
    const byYear: Record<number, string[]> = {};
    const index = makeIndex(data.games);
    for (let gg of data.geekGames) {
      if (gg.rating >= 8) {
        const game = index[gg.bggid];
        let games = byYear[game.yearPublished];
        if (!games) {
          games = [game.name];
          byYear[game.yearPublished] = games;
          this.rows.push({ year: game.yearPublished, games });
          this.rows.sort((y1,y2) => y1.year - y2.year);
        } else {
          games.push(game.name);
        }
      }
    }
  }

  private join(ss: string[]): string {
    return ss.join(", ");
  }
}
