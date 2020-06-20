import { Component, ViewChild, ElementRef } from '@angular/core';
import { DataViewComponent } from "extstats-angular";
import { VisualizationSpec } from "vega-embed";
import embed from "vega-embed";
import { Data, Result } from "../app.component"
import {SUBDOMAIN_COLOUR, SUBDOMAIN_SHAPE} from "../library";

type RatingVsMonthsData = { rating: number, months: number, tooltip: string, subdomain: string };

@Component({
  selector: 'extstats-rating-vs-months-played',
  templateUrl: './rating-vs-months-played.component.html'
})
export class RatingVsMonthsPlayedComponent extends DataViewComponent<Result> {
  @ViewChild('target') target: ElementRef;

  protected processData(data: Result): any {
    if (data) {
      const chartData = RatingVsMonthsPlayedComponent.extractRatingVsMonths(data.geekgames);
      const spec = RatingVsMonthsPlayedComponent.ratingsVsMonths(chartData);
      embed(this.target.nativeElement, spec, { actions: true });
    }
  }

  private static extractRatingVsMonths(data: Data): RatingVsMonthsData[] {
    const values = [];
    const gameById = {};
    for (const game of data.games) gameById[game.bggid] = game;
    for (const gg of data.geekGames) {
      if (gg.rating > 0) {
        values.push({ rating: gg.rating, months: gg.months, tooltip: gameById[gg.bggid].name, subdomain: gameById[gg.bggid].subdomain });
      }
    }
    return values;
  }

  private static ratingsVsMonths(values: RatingVsMonthsData[]): VisualizationSpec {
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
      "scales": [ {
        "name": "x",
        "type": "linear",
        "range": "width",
        "domain": [0, 10]
      }, {
        "name": "y",
        "type": "linear",
        "range": "height",
        "nice": true, "zero": true,
        "domain": {"data": "table", "field": "months"}
      },
        SUBDOMAIN_COLOUR,
        SUBDOMAIN_SHAPE],
      "axes": [
        {"orient": "bottom", "scale": "x", "zindex": 1, "title": "Your Rating" },
        {"orient": "left", "scale": "y", "zindex": 1, "title": "Number of months in which you have played this game" }
      ],
      "marks": [{
        "type": "symbol",
        "from": {"data": "table"},
        "encode": {
          "enter": {
            "x": { "scale": "x", "field": "rating"},
            "y": { "scale": "y", "field": "months"},
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
  }
}
