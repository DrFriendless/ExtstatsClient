import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {DataViewComponent} from "extstats-angular";
import {Data} from "../app.component";
import {makeIndex} from "extstats-core";
import embed, {VisualizationSpec} from "vega-embed";

interface ChartPoint {
  rating: number;
  weight: number;
  subdomain: string;
  name: string;
}

@Component({
  selector: 'rating-vs-weight',
  templateUrl: './rating-vs-weight.component.html'
})
export class RatingVsWeightComponent extends DataViewComponent<Data> {
  @Input() width = 600;
  @Input() height = 600;
  @ViewChild('target', { static: true }) target: ElementRef;

  protected processData(data: Data): any {
    const gamesIndex = makeIndex(data.games);
    const chartData: ChartPoint[] = [];
    for (const gg of data.geekGames) {
      const g = gamesIndex[gg.bggid];
      if (g.weight > 0 && gg.rating > 0) {
        chartData.push({ rating: gg.rating, weight: g.weight, subdomain: g.subdomain, name: g.name });
      }
    }
    this.refreshChart(chartData);
  }

  private refreshChart(data: ChartPoint[]) {
    const star = "M0,0.2L0.2351,0.3236 0.1902,0.0618 0.3804,-0.1236 0.1175,-0.1618 0,-0.4 -0.1175,-0.1618 -0.3804,-0.1236 -0.1902,0.0618 -0.2351,0.3236 0,0.2Z";
    const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega/v5.8.1.json",
      "hconcat": [],
      "padding": 5,
      "title": "Rating vs Weighting",
      "width": 800,
      "height": 600,
      "data": [{
        "name": "table",
        "values": data
      }],
      "scales": [
        {
          "name": "x",
          "type": "linear",
          "nice": true, "zero": true,
          "domain": [0, 10],
          "range": "width"
        }, {
          "name": "y",
          "type": "linear",
          "nice": true, "zero": false,
          "domain": [1, 5],
          "range": "height"
        }, {
          "name": "colour",
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
        {"orient": "bottom", "scale": "x", "zindex": 1, title: "Rating"},
        {"orient": "left", "scale": "y", "zindex": 1, title: "Weight"}
      ],
      "marks": [{
        "type": "symbol",
        "from": {"data": "table"},
        "encode": {
          "enter": {
            "x": { "scale": "x", "field": "rating"},
            "y": { "scale": "y", "field": "weight"},
            "size": { value: 100 },
            "tooltip": {"field": "name" },
            "stroke": { "field": "subdomain", "scale": "colour" },
            "shape": { "field": "subdomain", "scale": "shape" },
            "strokeWidth": {"value": 2}
          }
        }
      }],
      "legends": [{
        "direction": "vertical",
        "stroke": "colour",
        "shape": "shape"
      }]
    };
    embed(this.target.nativeElement, spec, { actions: true });
  }
}
