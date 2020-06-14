import { Component } from '@angular/core';
import { DataViewComponent } from "extstats-angular";
import { Column } from "extstats-datatable";
import {
  buildTooltip,
  calcHIndex,
  calcHoursPlayed,
  calcPercentPlayed,
  GameID,
  gameNames,
  PlayAndGamesIndex,
} from "../play-index"
import { makeKeySingle } from "../library"

@Component({
  selector: 'plays-by-month-ever',
  templateUrl: './plays-by-month-ever.component.html'
})
export class PlaysByMonthEverComponent extends DataViewComponent<PlayAndGamesIndex> {
  public rows: PlaysByMonthEverRow[] = []
  public columns: Column<PlaysByMonthEverRow>[] = [
    new Column({ field: "monthName", name: "Month", tooltip: "The month this row is for.", classname: "month-column" }),
    new Column({ field: "plays", name: "Plays", tooltip: "How many games you played in this month." }),
    new Column({ field: "new", name: "New Games", tooltip: "Games played for the first time ever.",
      valueTooltip: (r: PlaysByMonthEverRow) => r.newGameNames.join(", ") }),
    new Column({ field: "nickel", name: "New Nickels", tooltip: "Games played 5 times due to plays in this month.",
      valueTooltip: (r: PlaysByMonthEverRow) => r.nickelNames.join(", ") }),
    new Column({ field: "dime", name: "New Dimes", tooltip: "Games played 10 times due to plays in this month.",
      valueTooltip: (r: PlaysByMonthEverRow) => r.dimeNames.join(", ") }),
    new Column({ field: "quarter", name: "New Quarters", tooltip: "Games played 25 times due to plays in this month.",
      valueTooltip: (r: PlaysByMonthEverRow) => r.quarterNames.join(", ") }),
    new Column({ field: "dollar", name: "New Dollars", tooltip: "Games played 100 times due to plays in this month.",
      valueTooltip: (r: PlaysByMonthEverRow) => r.dollarNames.join(", ") }),
    new Column({ field: "hoursPlayed", name: "Hours Played", tooltip: "Approximate time it took you to play these games." }),
    new Column({ field: "hindex", name: "H-Index", tooltip: "You had played this many games this many times each at the end of this month." }),
    new Column({ field: "percent", name: "Percent Played",
      tooltip: "The percentage of your (presently) owned games that you had played by the end of the month."})
  ];

  protected processData(collection: PlayAndGamesIndex): void {
    this.rows = [];
    const everPlayed: Set<GameID> = new Set();
    for (const ym of collection.months || []) {
      const totalPlays = collection.everPlayIndex.getTotalPlays(ym)
      const minutesPlayed = calcHoursPlayed(totalPlays.byGame, collection.gamesIndex)
      const hoursPlayed = Math.floor(minutesPlayed / 6) / 10;
      const hindex = calcHIndex(collection.everPlaysPerMonth[ym])
      totalPlays.played.forEach(g => everPlayed.add(g))
      const percent = calcPercentPlayed(collection.ownedGames, everPlayed)
      const nd = collection.everPlayIndex.getEverNickelAndDimes(ym)
      this.rows.push({
        monthName: makeKeySingle(ym), plays: totalPlays.count, hindex, percent, hoursPlayed,
        new: totalPlays.new.size, newGameNames: gameNames(totalPlays.new, collection.gamesIndex),
        nickel: nd.nickel.size, nickelNames: gameNames(nd.nickel, collection.gamesIndex),
        dime: nd.dime.size, dimeNames: gameNames(nd.dime, collection.gamesIndex),
        quarter: nd.quarter.size, quarterNames: gameNames(nd.quarter, collection.gamesIndex),
        dollar: nd.dollar.size, dollarNames: gameNames(nd.dollar, collection.gamesIndex),
        nickelTooltip: buildTooltip(collection.gamesIndex, nd.nickel), dimeTooltip: buildTooltip(collection.gamesIndex, nd.dime),
        quarterTooltip: buildTooltip(collection.gamesIndex, nd.quarter), dollarTooltip: buildTooltip(collection.gamesIndex, nd.dollar),
      })
    }
  }
}

class PlaysByMonthEverRow {
  monthName: string
  plays: number
  new: number
  newGameNames: string[]
  nickel: number
  nickelNames: string[]
  dime: number
  dimeNames: string[]
  quarter: number
  quarterNames: string[]
  dollar: number
  dollarNames: string[]
  nickelTooltip: string
  dimeTooltip: string
  quarterTooltip: string
  dollarTooltip: string
  hindex: number
  percent: number
  hoursPlayed: number
}
