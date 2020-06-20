import { Component } from "@angular/core"
import {GameData, makeIndex} from "extstats-core"
import { DataViewComponent } from "extstats-angular"
import {Column, ColumnParams} from "extstats-datatable"
import { Data, GeekGameResult, Result } from "../app.component"
import {daysBetween, intToDate, toDateString} from "../library";

interface Row {
  gameName: string;
  rating: number;
  plays: number;
  bggRanking: number;
  bggRating: number;
  firstPlayed: string;
  lastPlayed: string;
  monthsPlayed: number;
  hoursPlayed: number;
  fhm: number;
  hhm: number;
  huberHeat: number;
  ruhm: number;
  yearPublished: number;
}

@Component({
  selector: "favourites-table",
  templateUrl: "./favourites-table.component.html",
})
export class FavouritesTableComponent extends DataViewComponent<Result> {
  private params: ColumnParams<Row>[] = [
    {field: "gameName", name: "Game"},
    {field: "rating", name: "Rating", tooltip: "Your rating for this game."},
    {field: "plays", name: "Plays", tooltip: "The number of times you have played this game."},
    {field: "bggRanking", name: "BGG Ranking", tooltip: "This game's ranking on BoardGameGeek."},
    {field: "bggRating", name: "BGG Rating", tooltip: "This game's rating on BoardGameGeek."},
    {field: "firstPlayed", name: "First Play", tooltip: "First date you played this game.", classname: "date-column"},
    {field: "lastPlayed", name: "Last Play", tooltip: "Last date you played this game.", classname: "date-column"},
    {field: "monthsPlayed", name: "Months Played", tooltip: "Number of months in which you have played this game."},
    {field: "hoursPlayed", name: "Hours Played", tooltip: "Hours for which you have played this game."},
    {field: "fhm", name: "Friendless", tooltip: "Friendless Happiness Metric"},
    {field: "hhm", name: "Huber", tooltip: "Huber Happiness Metric"},
    {field: "huberHeat", name: "Huber Heat", tooltip: "Huber Heat"},
    {field: "ruhm", name: "R!UHM", tooltip: "Randy Cox Not Unhappiness Metric"},
    {field: "yearPublished", name: "Published", tooltip: "The year in which this game was first published."}
  ];
  columns = this.params.map(c => new Column<Row>(c));
  rows: Row[] = []
  data: Data

  protected processData(data: Result) {
    if (!data) return
    this.data = data.geekgames
    const HUBER_BASELINE = 4.5
    const collection: GeekGameResult[] = this.data.geekGames
    const gamesIndex = makeIndex(this.data.games)
    this.rows = []
    collection.forEach(gg => {
      if (!gg.rating) gg.rating = undefined
      const game = gamesIndex[gg.bggid] || {name: "Unknown", bggRanking: 1000000, bggRating: 1.0} as GameData
      const hoursPlayed = gg.plays * game.playTime / 60
      const friendlessHappiness = (!gg.rating) ? undefined : Math.floor((gg.rating * 5 + gg.plays + gg.months * 4 + hoursPlayed) * 10) / 10
      const huberHappiness = (!gg.rating) ? undefined : Math.floor((gg.rating - HUBER_BASELINE) * hoursPlayed)
      let huberHeat = undefined
      if (gg.plays > 0 && gg.rating) {
        const s = 1 + gg.lyPlays / gg.plays
        const lyHours = gg.lyPlays * game.playTime / 60
        const lyHappiness = (gg.rating - HUBER_BASELINE) * lyHours
        huberHeat = s * s * Math.sqrt(gg.lyPlays) * lyHappiness
        huberHeat = Math.floor(huberHeat * 10) / 10
      }
      let ruhm = 0
      if (gg.months > 0 && gg.rating && gg.firstPlay && gg.lastPlay) {
        const firstDate = intToDate(gg.firstPlay)
        const lastDate = intToDate(gg.lastPlay)
        const flash = daysBetween(lastDate, firstDate)
        const lag = daysBetween(new Date(), lastDate)
        const flmr = flash / lag * gg.months * gg.rating
        const log = (flmr < 1) ? 0 : Math.log(flmr)
        ruhm = Math.round(log * 100) / 100
      }
      gg["fhm"] = friendlessHappiness
      gg["hhm"] = huberHappiness
      gg["hh"] = huberHeat
      gg["ruhm"] = ruhm
      const row = {
        gameName: game.name,
        game: gg.bggid,
        rating: Math.floor(gg.rating * 100)/100,
        plays: gg.plays,
        bggRanking: game.bggRanking,
        bggRating: Math.floor(game.bggRating * 100)/100,
        firstPlayed: toDateString(gg.firstPlay),
        lastPlayed: toDateString(gg.lastPlay),
        monthsPlayed: gg.months,
        yearsPlayed: gg.years,
        yearPublished: game.yearPublished,
        fhm: friendlessHappiness,
        hhm: huberHappiness,
        huberHeat,
        hoursPlayed: Math.floor(hoursPlayed),
        ruhm,
      } as Row
      this.rows.push(row)
    })
  }
}

