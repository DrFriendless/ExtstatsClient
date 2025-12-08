import { Component, ElementRef, ViewChild } from "@angular/core";
import { DataViewComponent } from "extstats-angular";
// @ts-ignore
import embed, {VisualizationSpec} from "vega-embed";
import {Data, GameResult, Result} from "../app.component"

@Component({
  selector: 'extstats-rating-vs-plays',
  templateUrl: './rating-vs-plays.component.html'
})
export class RatingVsPlaysComponent extends DataViewComponent<Result> {
  @ViewChild('target') target: ElementRef | undefined;

  protected processData(data: Result): any {
    if (data) {
      const chartData = RatingVsPlaysComponent.extractRatingVsPlays(data.geekgames);
      const spec = RatingVsPlaysComponent.ratingsVsPlays(chartData);
      embed(this.target!.nativeElement, spec, { actions: true });
    }
  }

  private static extractRatingVsPlays(data: Data): object {
    const values: { rating: number, plays: number, size?: number, tooltip?: string }[] = [];
    const doneKeys = [];
    const gameById: Record<string, GameResult> = {};
    for (const game of data.games) {
      gameById[game.bggid.toString()] = game;
    }
    const sizeSoFar: Record<string, number> = {};
    const tooltips: Record<string, string[]> = {};
    for (const gg of data.geekGames) {
      if (gg.rating > 0) {
        const plays = Math.min(gg.plays || 0, 40);
        const key = "" + gg.rating + "+" + plays;
        sizeSoFar[key] = (sizeSoFar[key] || 0) + 1;
        if (!tooltips[key]) tooltips[key] = [];
        tooltips[key].push(gameById[gg.bggid].name);
        const xy = { rating: gg.rating, plays };
        if (doneKeys.indexOf(key) < 0) {
          values.push(xy);
          doneKeys.push(key);
        }
      }
    }
    for (const xy of values) {
      const key = "" + xy.rating + "+" + xy.plays;
      xy.size = sizeSoFar[key] * 10;
      xy.tooltip = tooltips[key].join(", ");
    }
    return values;
  }

  private static ratingsVsPlays(values: object): VisualizationSpec {
    return {
      "$schema": "https://vega.github.io/schema/vega/v5.13.0.json",
      "hconcat": [],
      "autosize": {
        "type": "fit",
        "resize": true
      },
      "width": 900,
      "height": 600,
      "data": [ { values, name: "table" } ],
      "scales": [
        {
          "name": "x",
          "type": "linear",
          "nice": true, "zero": true,
          "range": "width",
          "domain": [0, 10]
        }, {
          "name": "y",
          "type": "linear",
          "range": "height",
          "nice": true, "zero": true,
          "domain": {"data": "table", "field": "plays"}
        }
      ],
      "axes": [
        {"orient": "bottom", "scale": "x", "zindex": 1, "title": "Your Rating" },
        {"orient": "left", "scale": "y", "zindex": 1, "title": "Number of Plays" }
      ],
      "marks": [{
        "type": "symbol",
        "from": {"data": "table"},
        "encode": {
          "enter": {
            "x": { "scale": "x", "field": "rating"},
            "y": { "scale": "y", "field": "plays"},
            "size": { "field": "size" },
            "tooltip": {"field": "tooltip"}
          }
        }
      }]
    };
  }
}
