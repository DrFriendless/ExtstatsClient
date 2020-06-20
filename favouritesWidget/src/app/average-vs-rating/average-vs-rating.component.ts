import {Component, ElementRef, ViewChild} from "@angular/core";
import {DataViewComponent} from "extstats-angular";
import embed, {VisualizationSpec} from "vega-embed";
import {GameResult, Result} from "../app.component"
import {star} from "../library";

type AverageVsRatingData = { rating: number, average: number, tooltip: string, subdomain: string };

@Component({
  selector: 'extstats-average-vs-rating',
  templateUrl: './average-vs-rating.component.html'
})
export class AverageVsRatingComponent extends DataViewComponent<Result> {
  @ViewChild('target') target: ElementRef;

  protected processData(result: Result): any {
    if (!result || !result.geekgames) return;
    const data = result.geekgames;
    const gameById: Record<string, GameResult> = {};
    for (const gd of data.games) gameById[gd.bggid] = gd;
    const chartData: AverageVsRatingData[] = [];
    for (const gg of data.geekGames) {
      if (gg.rating > 0 && gameById[gg.bggid].bggRating) {
        chartData.push({
          rating: gg.rating,
          average: gameById[gg.bggid].bggRating,
          tooltip: gameById[gg.bggid].name,
          subdomain: gameById[gg.bggid].subdomain
        });
      }
    }
    this.displayChart(chartData);
  }

  private displayChart(values: AverageVsRatingData[]): void {
    const anno1 =  [{ text: [ "These are games", "you like more", "than BGG does." ]}];
    const anno2 =  [{ text: [ "These are games", "BGG likes more", "than you do." ]}];
    const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega/v5.13.0.json",
      "hconcat": [],
      "autosize": { "type": "fit", "resize": true, "contains": "padding" },
      "width": 900,
      "height": 600,
      "config": { },
      "data": [
        { values, name: "table" },
        { name: "annotation1", values: anno1 },
        { name: "annotation2", values: anno2 }
        ],
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
            "size": { "value": 150 },
            "tooltip": {"field": "tooltip"},
            "stroke": { "field": "subdomain", "scale": "sub" },
            "shape": { "field": "subdomain", "scale": "shape" },
            "strokeWidth": {"value": 2}
          }
        }
      }, {
        "type": "text",
        "from": { data: "annotation1" },
        "encode": {
          "enter": {
            "x": { "scale": "x", "value": 7.5 },
            "y": { "scale": "y", "value": 1.7 },
            "fontSize": { value: 16 },
            "text": { "field": "text" },
            "zindex": { value: 10 },
            "fill": { value: "#159588" }
          }
        }
      }, {
        "type": "text",
        "from": { data: "annotation2" },
        "encode": {
          "enter": {
            "x": { "scale": "x", "value": 0.1 },
            "y": { "scale": "y", "value": 9.7 },
            "fontSize": { value: 16 },
            "text": { "field": "text" },
            "zindex": { value: 10 },
            "fill": { value: "#159588" }
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
