import {Component, ElementRef, EventEmitter, ViewChild} from '@angular/core';
import {DataViewComponent} from "extstats-angular";
import {Data, GameResult, Result} from "../app.component";
import embed, {VisualizationSpec} from "vega-embed";
import {intToDate, SUBDOMAIN_COLOUR, SUBDOMAIN_SHAPE} from "../library";
import {makeIndex} from "extstats-core";
import {Options} from "ng5-slider";

type FirstPlayedVsRatingData = { rating: number, firstPlayed: Date, tooltip: string, subdomain: string };

@Component({
  selector: 'first-played-vs-rating',
  templateUrl: './first-played-vs-rating.component.html'
})
export class FirstPlayedVsRatingComponent extends DataViewComponent<Result> {
  @ViewChild('target') target: ElementRef;
  private readonly thisYear = new Date().getFullYear();
  readonly widthOptions: Options = { floor: 300, ceil: 2000, step: 100, showTicks: true, showTicksValues: true };
  readonly heightOptions: Options = { floor: 100, ceil: 1000, step: 50, showTicks: true, showTicksValues: true };
  readonly playsOptions: Options = { floor: 1980, ceil: this.thisYear, step: 1, showTicks: true, showTicksValues: true,
    translate: (value: number) => value.toString().slice(2) };
  readonly fiddle = new EventEmitter<any>();
  private data: Data;
  private gameIndex: Record<string, GameResult> = {};
  PLAYS_LO = 2005;
  PLAYS_HI = this.thisYear;
  height = 600;
  width = 1000;

  ngOnInit(): void {
    this.fiddle.subscribe(junk => {
      this.recalc();
    });
  }

  protected processData(result: Result): any {
    if (!result || !result.geekgames) return;
    this.data = result.geekgames;
    this.gameIndex = makeIndex(this.data.games);
    this.fiddle.next(undefined);
  }

  private recalc(): void {
    const chartData: FirstPlayedVsRatingData[] = [];
    for (const gg of this.data.geekGames) {
      if (!gg.firstPlay) continue;
      const year = Math.floor(gg.firstPlay / 10000);
      if (year < this.PLAYS_LO || year > this.PLAYS_HI) continue;
      const game = this.gameIndex[gg.bggid];
      chartData.push({ rating: gg.rating, firstPlayed: intToDate(gg.firstPlay), tooltip: game.name, subdomain: game.subdomain });
    }
    this.displayChart(chartData);
  }

  private displayChart(values: FirstPlayedVsRatingData[]): void {
    const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega/v5.13.0.json",
      "hconcat": [],
      "autosize": { "type": "fit", "resize": true, "contains": "padding" },
      "width": this.width,
      "height": this.height,
      "config": { },
      "data": [
        { values, name: "table" }
      ],
      "scales": [ {
        "name": "x",
        "type": "time",
        "range": "width",
        "domain": { "data": "table", "field": "firstPlayed" }
      }, {
        "name": "y",
        "type": "linear",
        "nice": true, "zero": true,
        "domain": [0, 10],
        "range": "height"
      },
        SUBDOMAIN_COLOUR,
        SUBDOMAIN_SHAPE
      ],
      "axes": [
        {"orient": "bottom", "scale": "x", "zindex": 1, "title": "First Play Date", "domain": false },
        {"orient": "left", "scale": "y", "zindex": 1, "title": "Your Rating", "domain": false, "grid": true }
      ],
      "marks": [{
        "type": "symbol",
        "from": {"data": "table"},
        "encode": {
          "enter": {
            "x": { "scale": "x", "field": "firstPlayed"},
            "y": { "scale": "y", "field": "rating"},
            "size": { "value": 150 },
            "tooltip": {"field": "tooltip"},
            "stroke": { "field": "subdomain", "scale": "sub" },
            "shape": { "field": "subdomain", "scale": "shape" },
            "strokeWidth": {"value": 2}
          }
        }
      }],
      "legends": [{
        "direction": "vertical",
        "stroke": "sub",
        "shape": "shape"
      }]
    };
    embed(this.target.nativeElement, spec, { actions: true });
  }

}
