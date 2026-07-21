import {Component, TemplateRef, ViewChild} from "@angular/core"
import {makeIndex} from "extstats-core"
import {
  BoardGameLinkComponent,
  ButtonGroupButtonDirective,
  ButtonGroupComponent,
  DataViewComponent,
  DocumentationComponent, UserTagService
} from "extstats-angular";
import {
  Column,
  ColumnParams,
  DataTable,
  DataTableBody,
  DataTableController,
  DataTableHead,
  RowContext
} from "extstats-datatable"
import { Data, GeekGameResult, Result } from "../app.component"
import {daysBetween, intToDate, toDateString} from "../library";
import {GameData} from "extstats-api";

interface Row {
  bggid: number;
  name: string;
  tags: string[] | undefined;
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
  imports: [
    DataTableHead,
    DataTableBody,
    DataTableController,
    DataTable,
    ButtonGroupComponent,
    DocumentationComponent,
    ButtonGroupButtonDirective,
    BoardGameLinkComponent
  ]
})
export class FavouritesTableComponent extends DataViewComponent<Result> {
  @ViewChild('boardgame') boardgame!: TemplateRef<RowContext<Row>>;
  private params: ColumnParams<Row>[] = [
    {
      field: "name",
      name: "Game",
      tooltip: "The game you love",
      classname: "col-game-name",
      template: this.boardgame
    },
    {field: "rating", name: "Rating", tooltip: "Your rating for this game.", classname: "col-rating" },
    {field: "plays", name: "Plays", tooltip: "The number of times you have played this game.", classname: "col-number" },
    {field: "bggRanking", name: "BGG Ranking", tooltip: "This game's ranking on BoardGameGeek.", classname: "col-ranking" },
    {field: "bggRating", name: "BGG Rating", tooltip: "This game's rating on BoardGameGeek.", classname: "col-rating" },
    {field: "firstPlayed", name: "First Play", tooltip: "First date you played this game.", classname: "col-date" },
    {field: "lastPlayed", name: "Last Play", tooltip: "Last date you played this game.", classname: "col-date" },
    {field: "monthsPlayed", name: "Months Played", tooltip: "Number of months in which you have played this game.", classname: "col-number" },
    {field: "hoursPlayed", name: "Hours Played", tooltip: "Hours for which you have played this game.", classname: "col-number" },
    {field: "fhm", name: "Friendless", tooltip: "Friendless Happiness Metric", classname: "col-number" },
    {field: "hhm", name: "Huber", tooltip: "Huber Happiness Metric", classname: "col-number" },
    {field: "huberHeat", name: "Huber Heat", tooltip: "Huber Heat", classname: "col-number" },
    {field: "ruhm", name: "R!UHM", tooltip: "Randy Cox Not Unhappiness Metric", classname: "col-number" },
    {field: "yearPublished", name: "Published", tooltip: "The year in which this game was first published.", classname: "col-year" }
  ];
  columns: Column<Row>[] = [];
  rows: Row[] = [];
  data: Data | undefined;

  constructor(public tagService: UserTagService) {
    super();
  }

  public override ngAfterViewInit() {
    super.ngAfterViewInit();
    this.params[0].template = this.boardgame;
    this.columns = this.params.map(c => new Column<Row>(c));
  }

  protected processData(data: Result) {
    if (!data) return;
    this.data = data.geekgames
    const HUBER_BASELINE = 4.5
    const collection: GeekGameResult[] = this.data.geekGames
    const gamesIndex = makeIndex(this.data.games)
    this.rows = []
    collection.forEach(gg => {
      if (!gg.rating) gg.rating = 0;
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
      let ruhm = 0;
      if (gg.months > 0 && gg.rating && gg.firstPlay && gg.lastPlay) {
        const firstDate = intToDate(gg.firstPlay)!;
        const lastDate = intToDate(gg.lastPlay)!;
        const flash = daysBetween(lastDate, firstDate);
        const lag = daysBetween(new Date(), lastDate);
        const flmr = flash / lag * gg.months * gg.rating;
        const log = (flmr < 1) ? 0 : Math.log(flmr);
        ruhm = Math.round(log * 100) / 100;
      }
      // gg["fhm"] = friendlessHappiness
      // gg["hhm"] = huberHappiness
      // gg["hh"] = huberHeat
      // gg["ruhm"] = ruhm
      const row = {
        name: game.name,
        bggid: gg.bggid,
        tags: gg.tags,
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

