import {Component, ElementRef, ViewChild, EventEmitter} from '@angular/core';
import {PlaysViewComponent} from "extstats-angular";
import embed, {VisualizationSpec} from "vega-embed";
import {GameData, Result} from "../app.component";
import {LabelType, Options} from "ng5-slider";

interface ChartData {
  yq: number;
  year: number;
  quarter: number;
  published: number;
  plays: number;
  proportion: number;
  colour: number;
  tooltip: string;
}

@Component({
  selector: 'new-releases',
  templateUrl: './new-releases.component.html'
})
export class NewReleasesComponent extends PlaysViewComponent<Result> {
  @ViewChild('target', {static: true}) target: ElementRef;
  private result: Result;
  private gamesIndex: Record<string, GameData>
  GAME_CUTOFF = 1994;
  PLAY_CUTOFF = 2005;
  width = 1000;
  height = 600;
  readonly widthOptions: Options = { floor: 300, ceil: 2000, step: 100, showTicks: true, showTicksValues: true };
  readonly heightOptions: Options = { floor: 100, ceil: 1000, step: 50, showTicks: true, showTicksValues: true };
  readonly gameCutoffOptions: Options = { floor: 1980, ceil: 2010, step: 1, showTicks: true, showTicksValues: true,
    translate: (value: Number, label: LabelType) => value.toString().slice(2)
  };
  readonly playCutoffOptions: Options = { floor: 1990, ceil: 2020, step: 1, showTicks: true, showTicksValues: true,
    translate: (value: Number, label: LabelType) => value.toString().slice(2)
  };
  readonly fiddle = new EventEmitter<any>();

  ngOnInit(): void {
    this.fiddle.subscribe(junk => {
      this.recalc();
    });
  }

  protected processData(result: Result): any {
    if (!result || !result.monthly || !result.monthly.plays) return;
    this.result = result;
    this.gamesIndex = {}
    result.monthly.geekGames.forEach(gg => {
      this.gamesIndex[gg.game.bggid] = gg.game;
    });
    this.fiddle.next(undefined);
  }

  private recalc(): void {
    const fromQToYearToPlays: Record<string, Record<string, number>> = {}
    const totalByQuarter = {};
    const fromQToYearToNames: Record<string, Record<string, string[]>> = {}
    for (const play of this.result.monthly.plays) {
      if (play.year <= this.PLAY_CUTOFF) continue;
      const game = this.gamesIndex[play.bggid];
      const gamename = game.name;
      const q = Math.floor((play.month - 1) / 3);
      const yq = play.year * 100 + q + 1;
      const pubYear = Math.max(game.yearPublished, this.GAME_CUTOFF);
      const y2p = fromQToYearToPlays[yq] || {};
      const y2g = fromQToYearToNames[yq] || {};
      y2p[pubYear] = (y2p[pubYear] || 0) + play.quantity;
      const games = y2g[pubYear] || [];
      if (games.indexOf(gamename) < 0) games.push(gamename);
      totalByQuarter[yq] = (totalByQuarter[yq] || 0) + play.quantity;
      fromQToYearToPlays[yq] = y2p;
      y2g[pubYear] = games;
      fromQToYearToNames[yq] = y2g;
    }
    const data: ChartData[] = [];
    for (const yq in fromQToYearToPlays) {
      const yqi = parseInt(yq);
      const total = totalByQuarter[yq];
      for (const py in fromQToYearToPlays[yq]) {
        const pyi = parseInt(py);
        const plays = fromQToYearToPlays[yq][py];
        const names = fromQToYearToNames[yq][py];
        const games = names.join(", ");
        const tooltip = ((pyi <= this.GAME_CUTOFF) ? "up to " + pyi : pyi.toString()) + ": " + games;
        data.push({ yq: yqi, year: Math.floor(yqi/100), quarter: yqi % 100, colour: pyi % 20, plays, published: pyi,
          proportion: plays / total, tooltip });
      }
    }
    this.displayChart(data);
  }

  private displayChart(chartData: ChartData[]): void {
    const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega/v5.7.3.json",
      "hconcat": [],
      "padding": 5,
      "title": "How Much Do You Play New Releases?",
      "width": this.width,
      "height": this.height,
      "data": [{
        "name": "table",
        "values": chartData,
        "transform": [
          {
            "type": "stack",
            "groupby": ["yq"],
            "sort": {"field": "published"},
            "field": "proportion"
          }
        ]
      }],
      "scales": [
        {
          "name": "x",
          "type": "band",
          "range": "width",
          "domain": {"data": "table", "field": "yq"}
        },
        {
          "name": "y",
          "type": "linear",
          "range": "height",
          "nice": true, "zero": true,
          "domain": {"data": "table", "field": "y1"}
        },
        {
          "name": "color",
          "type": "ordinal",
          "range": { "scheme": "category20" },
          "domain": {"data": "table", "field": "colour"}
        }
      ],
      "axes": [
        { "orient": "bottom", "scale": "x", "zindex": 1, title: "Quarter",
          "encode": {
            "labels": {
              "interactive": true,
              "update": {
                "text": {"signal": "join([floor(datum.value/100), datum.value%10], ' Q')"},
                "angle": {"value": 90},
                "fontSize": {"value": 12},
                "align": {"value": "left"},
                "baseline": {"value": "middle"},
                "dx": {"value": 3}
              }
            }
          }}
      ],
      "marks": [
        {
          "type": "rect",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "x": {"scale": "x", "field": "yq"},
              "width": {"scale": "x", "band": 1, "offset": -1},
              "y": {"scale": "y", "field": "y0"},
              "y2": {"scale": "y", "field": "y1"},
              "fill": {"scale": "color", "field": "colour"},
              "tooltip": {"field": "tooltip"}
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
