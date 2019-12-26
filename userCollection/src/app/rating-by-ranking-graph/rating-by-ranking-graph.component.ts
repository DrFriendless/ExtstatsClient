import { Component } from '@angular/core';
import { makeIndex, roundRating} from "extstats-core";
import {DataViewComponent} from "extstats-angular";
import {Data} from "../app.component";

@Component({
  selector: 'rating-by-ranking-graph',
  templateUrl: './rating-by-ranking-graph.component.html'
})
export class RatingByRankingGraphComponent extends DataViewComponent<Data> {
  public rows = [];

  protected processData(data: Data): any {
    const result = [];
    const gamesIndex = makeIndex(data.games);
    const max = Math.max(...data.games.map(game => game.bggRanking));
    let row = [];
    row["title"] = "1-100";
    for (let i=0; i<=max; i++) {
      row.push({ rating: 0 });
      if (row.length === 100) {
        result.push(row);
        row = [];
        row["title"] = (i+1).toString() + "-" + (i+100).toString();
      }
    }
    if (row.length > 0) {
      result.push(row);
    }
    data.geekGames.forEach(gg => {
      const ranking = gamesIndex[gg.bggid].bggRanking;
      if (ranking) {
        const r = Math.floor((ranking - 1) / 100);
        const c = (ranking - 1) - r * 100;
        result[r][c].tooltip = gamesIndex[gg.bggid].name;
        if (result[r][c].tooltip) result[r][c].tooltip = "#" + ranking.toString() + " " + result[r][c].tooltip;
          if (gg.rating > 0) {
          result[r][c].rating = roundRating(gg.rating);
          if (result[r][c].tooltip) result[r][c].tooltip += (" (" + gg.rating.toString() + ")");
        }
      }
    });
    this.rows = result;
  }
}
