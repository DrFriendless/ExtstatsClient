import { Component } from "@angular/core"
import { DataViewComponent } from "extstats-angular"
import { Column } from "extstats-datatable";
import { makeKeySingle } from "../library";
import {
  calcHIndex,
  GameID,
  gameNames,
  PlayAndGamesIndex,
  splitExpansions,
  TotalPlays,
  calcPercentPlayed,
  YearTo, calcHoursPlayed, GamePlays,
} from "../play-index"

@Component({
  selector: "plays-by-month-ytd",
  templateUrl: "./plays-by-month-ytd.component.html",
})
export class PlaysByMonthYtdComponent extends DataViewComponent<PlayAndGamesIndex> {
  public columns: Column<Row>[] = [
    new Column({ field: "month", name: "Month", tooltip: "The month this row is for.", classname: "month-column" }),
    new Column({ field: "plays", name: "Plays", tooltip: "How many games you played in this month." }),
    new Column({ field: "distinct", name: "Distinct Games", tooltip: "Different games played this month.",
      valueTooltip: (r: Row) => r.gamesPlayedNames.join(", ") }),
    new Column({ field: "expansions", name: "Expansions", tooltip: "Different expansions played this month.",
      valueTooltip: (r: Row) => r.expansionNames.join(", ") }),
    new Column({ field: "newNickels", name: "New Nickels", tooltip: "Games played 5 times this year due to plays in this month.",
      valueTooltip: (r: Row) => r.newNickelNames.join(", ") }),
    new Column({ field: "newDimes", name: "New Dimes", tooltip: "Games played 10 times this year due to plays in this month.",
      valueTooltip: (r: Row) => r.newDimeNames.join(", ") }),
    new Column({ field: "newQuarters", name: "New Quarters", tooltip: "Games played 25 times this year due to plays in this month.",
      valueTooltip: (r: Row) => r.newQuarterNames.join(", ") }),
    new Column({ field: "newDollars", name: "New Dollars", tooltip: "Games played 100 times this year due to plays in this month.",
      valueTooltip: (r: Row) => r.newDollarNames.join(", ") }),
    new Column({ field: "hoursPlayed", name: "Hours Played", tooltip: "Approximate time it took you to play these games cumulative for the year." }),
    new Column({ field: "hindex", name: "H-Index", tooltip: "You had played this many games this many times each at the end of this month." }),
    new Column({ field: "percent", name: "Percent Played",
      tooltip: "The percentage of your (presently) owned games that you had played by the end of the month."}),
  ]
  public rows: Row[] = []

  protected processData(collection: PlayAndGamesIndex): void {
    this.rows = []
    const yearPlayed: YearTo<Set<GameID>> = {};
    for (const ym of collection.months || []) {
      const totalPlays: TotalPlays = collection.everPlayIndex.getTotalPlays(ym)
      const distinct = totalPlays.distinct
      const plays = totalPlays.count
      const sortOrder = ym
      const january = ym % 100 === 0
      const year = Math.floor(ym / 100)
      const be = splitExpansions(totalPlays.played, collection.gamesIndex)
      const gamesPlayedNames = gameNames(be.base, collection.gamesIndex)
      const nd = collection.everPlayIndex.getYearlyNickelAndDimes(ym)
      const ytdPlays: GamePlays = (collection.yearlyPlaysPerMonth[year] || {})[ym] || {}
      const minutesPlayed = calcHoursPlayed(ytdPlays, collection.gamesIndex)
      const hoursPlayed = Math.floor(minutesPlayed / 6) / 10;
      const hindex = calcHIndex(ytdPlays)
      if (!yearPlayed[year]) yearPlayed[year] = new Set()
      totalPlays.played.forEach(g => yearPlayed[year].add(g))
      const percent = calcPercentPlayed(collection.ownedGames, yearPlayed[year])

      const row: Row = {
        month: makeKeySingle(ym), distinct, plays, sortOrder, year, january, gamesPlayedNames, hindex, percent,
        expansions: be.expansions.size, expansionNames: gameNames(be.expansions, collection.gamesIndex),
        newNickels: nd.nickel.size, newNickelNames: gameNames(nd.nickel, collection.gamesIndex),
        newDimes: nd.dime.size, newDimeNames: gameNames(nd.dime, collection.gamesIndex),
        newQuarters: nd.quarter.size, newQuarterNames: gameNames(nd.quarter, collection.gamesIndex),
        newDollars: nd.dollar.size, newDollarNames: gameNames(nd.dollar, collection.gamesIndex),
        hoursPlayed }
      this.rows.push(row)
      this.rows.sort((r1, r2) => r1.sortOrder - r2.sortOrder)
    }
  }


}

interface Row {
  month: string
  sortOrder: number
  distinct: number
  plays: number
  january: boolean
  year: number
  expansions: number
  newNickels: number
  newDimes: number
  newQuarters: number
  newDollars: number
  expansionNames: string[]
  gamesPlayedNames: string[]
  newNickelNames: string[]
  newDimeNames: string[]
  newQuarterNames: string[]
  newDollarNames: string[]
  hindex: number
  percent: number
  hoursPlayed: number
}
