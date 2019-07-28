import { Component } from "@angular/core"
import { DataViewComponent } from "extstats-angular"
import { Column } from "extstats-datatable/lib/src/DataTable"
import { Data, makeGamesIndex, Result } from "../app.component"

@Component({
  selector: 'you-should-play',
  templateUrl: './you-should-play.component.html'
})
export class YouShouldPlayComponent extends DataViewComponent<Result> {

  public columns: Column<Row>[] = [
    new Column({ field: "gameName", name: "Game",
      valueHtml: (row) => `<a href="https://boardgamegeek.com/boardgame/${row.game}">${row.gameName}</a>`
    }),
    new Column({ field: "rating", name: "Rating", tooltip: "Your rating for this game." }),
    new Column({ field: "plays", name: "Plays", tooltip: "The number of times you have played this game." }),
    new Column({ field: "lastPlayed", name: "Last Played", tooltip: "Last date you played this game." }),
    new Column({ field: "daysSincePlayed", name: "Days Since Last Play", tooltip: "Days since you last played this game." })
  ]
  public rows: Row[] = []
  public data: Data

  protected processData(data: Result) {
    if (!data || !data.geekgames) return
    this.data = data.geekgames
    const gamesIndex = makeGamesIndex(this.data.games)
    const rows: Row[] = []
    this.data.geekGames.forEach(gg => {
      if (gg.rating > 0) {
        const game = gamesIndex[gg.bggid]
        const row: Row = {
          gameName: game.name,
          game: gg.bggid,
          rating: gg.rating,
          plays: gg.plays,
          lastPlayed: YouShouldPlayComponent.toDateString(gg.lastPlay),
          shouldPlayScore: gg.shouldPlayScore,
          daysSincePlayed: gg.daysSincePlayed
        }
        rows.push(row)
      }
    })
    rows.sort((a, b) => {
      return b.shouldPlayScore - a.shouldPlayScore
    })
    this.rows = (rows.length > 20) ? rows.slice(0, 20) : rows
  }

  private static toDateString(date: number): string {
    if (!date) return ""
    const y = Math.floor(date / 10000)
    const m = Math.floor(date / 100) % 100
    const d = date % 100
    const mm = (m < 10) ? "0" + m.toString() : m.toString()
    const dd = (d < 10) ? "0" + d.toString() : d.toString()
    return y.toString() + "-" + mm + "-" + dd
  }
}

interface Row {
  gameName: string;
  game: number;
  rating: number;
  plays: number;
  lastPlayed: string;
  shouldPlayScore: number;
  daysSincePlayed: number;
}

