import { Component, ElementRef, ViewChild } from "@angular/core";
import { DataViewComponent } from "extstats-angular";
import embed, { VisualizationSpec } from "vega-embed";
import { Data, GameResult, Result } from "../app.component"

type AverageVsRatingData = { rating: number, average: number, tooltip: string, subdomain: string };

@Component({
  selector: 'extstats-average-vs-rating',
  templateUrl: './average-vs-rating.component.html'
})
export class AverageVsRatingComponent extends DataViewComponent<Result> {
  @ViewChild('target') target: ElementRef;

  protected processData(data: Result): any {
    if (data) {
      const chartData = AverageVsRatingComponent.extractAvgVsRating(data.geekgames);
      const spec = AverageVsRatingComponent.avrSpec(chartData);
      embed(this.target.nativeElement, spec, { actions: true });
    }
  }

  private static extractAvgVsRating(data: Data): AverageVsRatingData[] {
    const gameById: Record<string, GameResult> = {};
    for (const gd of data.games) gameById[gd.bggid] = gd;
    const values = [];
    for (const gg of data.geekGames) {
      if (gg.rating > 0 && gameById[gg.bggid].bggRating) {
        values.push({
          rating: gg.rating,
          average: gameById[gg.bggid].bggRating,
          tooltip: gameById[gg.bggid].name,
          subdomain: gameById[gg.bggid].subdomain
        });
      }
    }
    return values;
  }

  private static avrSpec(values: AverageVsRatingData[]): VisualizationSpec {
    const star = "M0,0.2L0.2351,0.3236 0.1902,0.0618 0.3804,-0.1236 0.1175,-0.1618 0,-0.4 -0.1175,-0.1618 -0.3804,-0.1236 -0.1902,0.0618 -0.2351,0.3236 0,0.2Z";
    const spec = {
      "$schema": "https://vega.github.io/schema/vega/v4.json",
      "hconcat": [],
      "autosize": { "type": "fit", "resize": true, "contains": "padding" },
      "width": 900,
      "height": 600,
      "config": { },
      "data": [ { values, name: "table" } ],
      "scales": [ {
        "name": "x",
        "type": "linear",
        "nice": true, "zero": true,
        "domain": [0, 10],
        "range": "width"
      }, {
        "name": "y",
        "type": "linear",
        "nice": true, "zero": true,
        "domain": [0, 10],
        "range": "height"
      }, {
        "name": "sub",
        "type": "ordinal",
        "domain": ["Abstract Games", "Children's Games", "Customizable Games", "Family Games", "Party Games",
          "Strategy Games", "Thematic Games", "Unknown", "Wargames"],
        "range": ['#000000', '#f0d000', "#A4C639", '#20d0d0', '#f02020', '#4381b2', '#fab6b6', "#888888", '#BDB76B' ]
      }, {
        "name": "shape",
        "type": "ordinal",
        "domain": ["Abstract Games", "Children's Games", "Customizable Games", "Family Games", "Party Games",
          "Strategy Games", "Thematic Games", "Unknown", "Wargames"],
        "range": ['circle', 'square', "cross", 'diamond', 'triangle-up', 'triangle-down', 'triangle-right', "triangle-left", star ]
      }
      ],
      "axes": [
        {"orient": "bottom", "scale": "x", "zindex": 1, "title": "Your Rating", "domain": false },
        {"orient": "left", "scale": "y", "zindex": 1, "title": "BGG Average", "domain": false, "grid": true }
      ],
      "marks": [{
        "type": "symbol",
        "from": {"data": "table"},
        "encode": {
          "enter": {
            "x": { "scale": "x", "field": "rating"},
            "y": { "scale": "y", "field": "average"},
            "size": 150,
            "tooltip": {"field": "tooltip", "type": "quantitative"},
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
    return spec as VisualizationSpec;
  }
}
