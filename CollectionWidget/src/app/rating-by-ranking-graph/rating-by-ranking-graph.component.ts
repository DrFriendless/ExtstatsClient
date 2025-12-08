import { Component } from '@angular/core';
import { makeIndex, roundRating} from "extstats-core";
import {DataViewComponent} from "extstats-angular";
import {Data} from "../app.component";
import {NgClass} from "@angular/common";

interface Row {
  title: string;
  columns: { rating: number, tooltip: string }[];
}

@Component({
  selector: 'rating-by-ranking-graph',
  imports: [
    NgClass
  ],
  templateUrl: './rating-by-ranking-graph.component.html'
})
export class RatingByRankingGraphComponent extends DataViewComponent<Data> {
  public rows: Row[] = [];

  protected processData(data: Data): any {
    const result: Row[] = [];
    const gamesIndex = makeIndex(data.games);
    const max = Math.max(...data.games.map(game => game.bggRanking));
    let row: Row = { title: "1-100", columns: [] };
    for (let i=0; i<=max; i++) {
      row.columns.push({ rating: 0, tooltip: "" });
      if (row.columns.length === 100) {
        result.push(row);
        row = { title: (i+1).toString() + "-" + (i+100).toString(), columns: [] };
      }
    }
    if (row.columns.length > 0) {
      result.push(row);
    }
    data.geekGames.forEach(gg => {
      const ranking = gamesIndex[gg.bggid].bggRanking;
      if (ranking) {
        const r = Math.floor((ranking - 1) / 100);
        const c = (ranking - 1) - r * 100;
        result[r].columns[c].tooltip = gamesIndex[gg.bggid].name;
        if (result[r].columns[c].tooltip) result[r].columns[c].tooltip = "#" + ranking.toString() + " " + result[r].columns[c].tooltip;
          if (gg.rating > 0) {
          result[r].columns[c].rating = roundRating(gg.rating);
          if (result[r].columns[c].tooltip) result[r].columns[c].tooltip += (" (" + gg.rating.toString() + ")");
        }
      }
    });
    this.rows = result;
  }
}
