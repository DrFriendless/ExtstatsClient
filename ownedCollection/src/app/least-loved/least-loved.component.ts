import { Component } from '@angular/core';
import { makeIndex } from "extstats-core";
import { DataViewComponent } from "extstats-angular";
import { Column } from "extstats-datatable/lib/src/DataTable";
import {Data, formatDate, ymdToDate} from "../app.component";

interface LeastLovedRow {
    game: number;
    gameName: string;
    rating: number;
    lastPlayed: string;
    leastLovedScore: number;
    daysSince: number;
    forTrade: boolean;
    plays: number;
}

@Component({
  selector: 'least-loved',
  templateUrl: './least-loved.component.html'
})
export class LeastLovedComponent extends DataViewComponent<Data> {
  public columns: Column<LeastLovedRow>[] = [
    new Column({ field: "gameName", name: "Game",
      valueHtml: (row) => `<a href="https://boardgamegeek.com/boardgame/${row.game}">${row.gameName}</a>`
    }),
    new Column({ field: "rating", name: "Rating", tooltip: "Your rating for this game." }),
    new Column({ field: "lastPlayed", name: "Last Played", tooltip: "Last date you played this game." }),
    new Column({ field: "daysSince", name: "Days Since Last Play", tooltip: "Days since you last played this game." }),
    new Column({ field: "plays", name: "Plays", tooltip: "Times you have ever played this game." }),
    new Column( { field: "forTrade", name: "For Trade",
      valueHtml: (row) => (row.forTrade) ? "yes" : "&nbsp;"
    })
  ];

  public rows: LeastLovedRow[] = [];

  protected processData(data: Data): any {
    if (!data || !data.geekGames) return;
    const now = new Date();
    const gamesIndex = makeIndex(data.games);
    const rows: LeastLovedRow[] = [];
    data.geekGames.forEach(gg => {
      if (gg.rating > 0 && gg.lastPlay) {
        const game = gamesIndex[gg.bggid];
        const lp = ymdToDate(gg.lastPlay);
        const daysSince = Math.round((now.valueOf() - lp.valueOf()) / 86400000);
        const ll = daysSince / gg.rating / gg.rating;
        const row: LeastLovedRow = {
          gameName: game.name,
          game: gg.bggid,
          rating: gg.rating,
          lastPlayed: formatDate(gg.lastPlay),
          daysSince: daysSince,
          leastLovedScore: ll,
          forTrade: gg.forTrade,
          plays: gg.plays
        };
        rows.push(row);
      }
    });
    rows.sort((a, b) => {
      return b.leastLovedScore - a.leastLovedScore
    });
    this.rows = (rows.length > 30) ? rows.slice(0, 30) : rows
  }
}
