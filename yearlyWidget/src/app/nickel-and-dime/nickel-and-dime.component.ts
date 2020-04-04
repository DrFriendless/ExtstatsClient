import { Component } from '@angular/core';
import {PlaysViewComponent} from "extstats-angular";
import {Result} from "../app.component";
import {makeIndex} from "extstats-core";
import {Counter} from "../library";

export interface Row {
  plays: number;
  name: string;
  url: string;
}

@Component({
  selector: 'nickel-and-dime',
  templateUrl: './nickel-and-dime.component.html',
  styleUrls: ['./nickel-and-dime.component.scss']
})
export class NickelAndDimeComponent extends PlaysViewComponent<Result> {
  dollars: Row[] = [];
  quarters: Row[] = [];
  nickels: Row[] = [];
  dimes: Row[] = [];
  nearly: Row[] = [];

  protected processData(data: Result): any {
    if (!data || !data.plays || !data.plays.geeks || !data.plays.geeks.length) return;
    this.dollars = [];
    this.quarters = [];
    this.nickels = [];
    this.dimes = [];
    this.nearly = [];

    const gamesIndex = makeIndex(data.plays.games);
    const counter = new Counter();
    for (const p of data.plays.plays) {
      if (gamesIndex[p.game].isExpansion) continue;
      counter.add(p.game, p.quantity);
    }
    const desc = counter.descfunc(n => gamesIndex[n].name);
    for (const key of desc) {
      const plays = counter.get(key);
      if (plays < 4) break;
      const game = gamesIndex[key];
      const row = { plays, name: game.name, url: `https://boardgamegeek.com/boardgame/${game.bggid}` };
      if (plays >= 100) {
        this.dollars.push(row);
      } else if (plays >= 25) {
        this.quarters.push(row);
      } else if (plays >= 10) {
        this.dimes.push(row);
      } else if (plays >= 5) {
        this.nickels.push(row);
      } else {
        this.nearly.push(row);
      }
    }
  }
}
