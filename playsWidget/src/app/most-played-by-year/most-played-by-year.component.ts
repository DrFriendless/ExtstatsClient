import {Component, ElementRef, EventEmitter, ViewChild} from '@angular/core';
import {PlaysViewComponent} from "extstats-angular";
import { makeIndex} from "extstats-core";
import embed, {VisualizationSpec} from "vega-embed";
import {Result} from "../app.component";
import {Options} from "ng5-slider";

type PlaysOfGames = {
  year: number;
  plays: Record<string, number>;
  top10: number[];
  top10Count: number[];
  otherPlayCount: number;
};
type ByYear = {
  years: Record<number, PlaysOfGames>;
  distinguishedGames: number[];
};
type DataPoint = {
  year: Date;
  game: string;
  name: string;
  count: number;
  y: number;
}

function findTop(plays: Record<string, number>, howMany: number): string[] {
  const counts: number[] = Object.values(plays).sort((a, b) => b-a);
  let min;
  if (counts.length <= howMany) {
    min = counts[counts.length-1];
  } else {
    min = counts[howMany-1];
  }
  if (min < 2) min = 2;
  return Object.entries(plays).filter(kv => kv[1] >= min).map(kv => kv[0]);
}

@Component({
  selector: 'most-played-by-year',
  templateUrl: './most-played-by-year.component.html'
})
export class MostPlayedByYearComponent extends PlaysViewComponent<Result> {
  @ViewChild('target', {static: true}) target: ElementRef;
  howMany = 20;
  readonly howManyOptions: Options = { floor: 3, ceil: 40, step: 1, showTicks: true, showTicksValues: true };
  readonly fiddle = new EventEmitter<any>();

  private allPlays: Record<string, number> = {};
  private byYear: ByYear;
  private gamesIndex: Record<string, { name: string }>;

  ngOnInit(): void {
    this.fiddle.subscribe(junk => {
      this.recalc();
    });
  }

  protected processData(d: Result) {
    if (!d || !d.plays || !d.plays.games || !d.plays.plays) return;
    const data = d.plays;
    const plays = data.plays;
    this.gamesIndex = makeIndex(data.games);
    this.byYear = { years: {}, distinguishedGames: [] };
    this.allPlays = {}
    plays.forEach(p => {
      if (!this.byYear.years[p.year]) this.byYear.years[p.year] =
        { year: p.year, plays: {}, top10: [], top10Count: [], otherPlayCount: 0 } as PlaysOfGames;
      const pog: PlaysOfGames = this.byYear.years[p.year];
      pog.plays[p.game] = (pog.plays[p.game] || 0) + p.quantity;
      this.allPlays[p.game] = (this.allPlays[p.game] || 0) + p.quantity;
    });
    this.fiddle.next();
  }

  private recalc() {
    const top: string[] = findTop(this.allPlays, this.howMany);
    const values: DataPoint[] = [];
    Object.values(this.byYear.years).forEach((year: PlaysOfGames) => {
      top.forEach(bggid => {
        const v = year.plays[bggid];
        if (v) {
          const g = this.gamesIndex[bggid];
          values.push({ y: year.plays[bggid], count: year.plays[bggid], game: bggid,
            name: g.name + " (" + year.plays[bggid] + ")", year: new Date(year.year, 7) });
        }
      });
    });
    this.refreshChart(values);
  }

  private refreshChart(data: DataPoint[]) {
    const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega/v5.7.3.json",
      "hconcat": [],
      "padding": 5,
      "title": `Plays of ${this.howMany} Most Played Games by Year`,
      "width": 900,
      "height": 600,
      "data": [{
        "name": "table",
        "values": data,
        "transform": [
          {
            "type": "stack",
            "groupby": ["year"],
            "sort": {"field": "game"},
            "field": "y"
          }
        ]
      }],
      "scales": [
        {
          "name": "xscale",
          "type": "band",
          "range": "width",
          "domain": { "data": "table", "field": "year" }
        }, {
          "name": "y",
          "type": "linear",
          "range": "height",
          "nice": true, "zero": true,
          "domain": {"data": "table", "field": "y1"}
        }, {
          "name": "colour",
          "type": "ordinal",
          "range": { "scheme": "category20" },
          "domain": {"data": "table", "field": "game"}
        }
      ],
      "axes": [
        { "orient": "bottom", "scale": "xscale", "zindex": 1, title: "Year", "formatType": "time", "format": "%y" },
        { "orient": "right", "scale": "y", "zindex": 1, title: "Plays" }
      ],
      "marks": [
        {
          "type": "rect",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "x": {"scale": "xscale", "field": "year"},
              "width": {"scale": "xscale", "band": 1, "offset": -1},
              "y": {"scale": "y", "field": "y0"},
              "y2": {"scale": "y", "field": "y1"},
              "fill": {"scale": "colour", "field": "game"},
              "tooltip": {"field": "name"}
            },
            "update": {
              "fillOpacity": {"value": 1}
            },
            "hover": {
              "fillOpacity": {"value": 0.5}
            }
          }
        }
      ]
    };
    embed(this.target.nativeElement, spec, { actions: true });
  }
}

