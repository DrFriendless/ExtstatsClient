import {Component, EventEmitter} from '@angular/core';
import {ButtonGroupButtonDirective, ButtonGroupComponent, PlaysViewComponent} from "extstats-angular";
import { makeIndex} from "extstats-core";
import {GameData, PlayData, Result} from "../app.component";
import {LoginService} from "../login.service";
import {NgxSliderModule, Options} from "@angular-slider/ngx-slider";
import {Column, DataTable, DataTableBody, DataTableController, DataTableHead} from "extstats-datatable";
import {stddev, StddevRange} from "../library";

interface Row {
  name: string;
  plays: Record<string, number>;
  total: number;
  sd?: StddevRange;
  bggid: number;
  years: number;
}

@Component({
  selector: 'plays-by-year-table',
  templateUrl: './plays-by-year.component.html',
  standalone: true,
  imports: [
    ButtonGroupComponent,
    ButtonGroupButtonDirective,
    NgxSliderModule,
    DataTable,
    DataTableBody,
    DataTableController,
    DataTableHead
  ]
})
export class PlaysByYearTableComponent extends PlaysViewComponent<Result> {
  rows: Row[] = [];
  columns: Column<Row>[] = [];
  plays: PlayData[] = [];
  howMany = 40;

  readonly howManyOptions: Options = { floor: 10, ceil: 200, step: 10, showTicks: true, showTicksValues: true };
  readonly fiddle = new EventEmitter<undefined>();

  private gamesIndex: Record<string, GameData> = {};

  constructor(loginService: LoginService) {
    super();
    loginService.registerFeature("pbyt");
  }

  ngOnInit(): void {
    this.fiddle.subscribe(ignored => {
      this.recalc();
    });
  }

  protected processData(d: Result) {
    if (!d || !d.plays || !d.plays.games || !d.plays.plays) return;
    const data = d.plays;
    this.plays = d.plays.plays;
    this.gamesIndex = makeIndex(data.games);
    this.fiddle.next(undefined);
  }

  private recalc() {
    const playsByGame: Record<string, number> = {};
    this.plays.forEach(p => {
      const n = playsByGame[p.bggid.toString()] || 0;
      playsByGame[p.bggid.toString()] = n + p.quantity;
    });
    const es = [...Object.entries(playsByGame)];
    es.sort((e0, e1) => e1[1] - e0[1]);
    const hm = Math.min(es.length, this.howMany === 0 ? 20 : this.howMany);
    const games = es.slice(0, hm).map(e0 => parseInt(e0[0]));
    const playsByGameByYear: Record<string, Record<string, number>> = {};
    const years: string[] = [];
    this.plays.filter(p => games.indexOf(p.bggid) >= 0).forEach(p => {
      const gs = p.bggid.toString();
      const ys = p.year.toString();
      if (years.indexOf(ys) < 0) years.push(ys);
      if (!(gs in playsByGameByYear)) playsByGameByYear[gs] = {};
      if (!(ys in playsByGameByYear[gs])) playsByGameByYear[gs][ys] = 0;
      playsByGameByYear[gs][ys] = playsByGameByYear[gs][ys] + p.quantity;
    });
    years.sort((y1, y2) => parseInt(y1) - parseInt(y2));
    // build the columns
    this.columns = [
      new Column<Row>({
        field: "name",
        name: "Game",
        tooltip: "The name of the game",
        valueHtml: (r: Row) =>  `<a href="https://boardgamegeek.com/boardgame/${r.bggid}">${r.name}</a>`,
        classname: "wide"
      }),
      new Column<Row>({ field: "total", name: "Total", tooltip: "Total plays ever for this game" }),
    ];
    this.rows = [];

    for (const ys of years) {
      this.columns.push(new Column<Row>({
        field: ys,
        name: ys,
        tooltip: `Plays in ${ys}`,
        valueHtml: (r: Row) => (r.plays[ys] || 0).toString(),
        valueTooltip: (r: Row) => `${(r.plays[ys] || 0).toString()} plays in ${ys}`,
        rowClassname: (r: Row) => {
          const c = r.plays[ys] || 0;
          if (c === 0) return "class0";
          if (c <= 2) return "class1";
          if (c <= 5) return "class2";
          if (c <= 10) return "class3";
          if (c <= 25) return "class4";
          return "class5";
        }
      }));
    }
    this.columns.push(new Column<Row>({
      field: "years",
      name: "Total",
      tooltip: "Total years in which this game has been played",
      valueHtml: (row: Row) => `<b>${row.years}</b>`,
      valueTooltip: (row: Row) => `${row.years}`
    }));
    // build the rows
    const values: number[] = [];
    for (const g of games) {
      const gs = g.toString();
      const plays = playsByGameByYear[gs] || {};
      const row = {
        name: this.gamesIndex[gs].name,
        plays,
        total: playsByGame[gs],
        bggid: g,
        years: years.filter(y => !!plays[y]).length
      };
      years.forEach(year => values.push(plays[year] || 0));
      this.rows.push(row);
    }
    const sd = stddev(values);
    this.rows.forEach(r => r.sd = sd);
  }
}

