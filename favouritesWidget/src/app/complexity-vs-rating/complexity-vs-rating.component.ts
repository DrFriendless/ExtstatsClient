import {Component, ElementRef, ViewChild} from '@angular/core';
import {DataViewComponent} from "extstats-angular";
import {GameResult, Result} from "../app.component";
import embed, {VisualizationSpec} from "vega-embed";
import {BGG_DOMAINS, star} from "../library";

type ComplexityVsRatingData = { rating: number, weight: number, tooltip: string, subdomain: string };

@Component({
  selector: 'complexity-vs-rating',
  templateUrl: './complexity-vs-rating.component.html'
})
export class ComplexityVsRatingComponent extends DataViewComponent<Result> {
  @ViewChild('target') target: ElementRef;

  protected processData(result: Result): any {
    if (!result || !result.geekgames) return;
    const data = result.geekgames;
    const gameById: Record<string, GameResult> = {};
    for (const gd of data.games) gameById[gd.bggid] = gd;
    const chartData: ComplexityVsRatingData[] = [];
    for (const gg of data.geekGames) {
      const game = gameById[gg.bggid];
      if (gg.rating > 0 && game.weight > 0) {
        chartData.push({
          rating: gg.rating,
          weight: game.weight,
          tooltip: game.name,
          subdomain: game.subdomain
        });
      }
    }
    this.displayChart(chartData);
  }

  private displayChart(values: ComplexityVsRatingData[]): void {
    const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega/v5.13.0.json",
      "hconcat": [],
      "autosize": { "type": "fit", "resize": true, "contains": "padding" },
      "width": 900,
      "height": 600,
      "config": { },
      "data": [
        { values, name: "table" }
      ],
      "scales": [ {
        "name": "x",
        "type": "linear",
        "nice": false,
        "domain": [1, 5],
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
        "domain": BGG_DOMAINS,
        "range": ['#000000', '#f0d000', "#A4C639", '#20d0d0', '#f02020', '#4381b2', '#fab6b6', "#888888", '#BDB76B' ]
      }, {
        "name": "shape",
        "type": "ordinal",
        "domain": BGG_DOMAINS,
        "range": ['circle', 'square', "cross", 'diamond', 'triangle-up', 'triangle-down', 'triangle-right', "triangle-left", star ]
      }
      ],
      "axes": [
        {"orient": "bottom", "scale": "x", "zindex": 1, "title": "BGG Weight", "domain": false },
        {"orient": "left", "scale": "y", "zindex": 1, "title": "Your Rating", "domain": false, "grid": true }
      ],
      "marks": [{
        "type": "symbol",
        "from": {"data": "table"},
        "encode": {
          "enter": {
            "x": { "scale": "x", "field": "weight"},
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
