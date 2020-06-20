import {Component, ElementRef, ViewChild} from '@angular/core';
import {DataViewComponent} from "extstats-angular";
import {GameResult, Result} from "../app.component";
import embed, {VisualizationSpec} from "vega-embed";
import {BGG_DOMAINS, star, SUBDOMAIN_COLOUR, SUBDOMAIN_SHAPE} from "../library";

type ComplexityVsPlaysData = { complexity: number, plays: number, tooltip: string, subdomain: string };

@Component({
  selector: 'complexity-vs-plays',
  templateUrl: './complexity-vs-plays.component.html'
})
export class ComplexityVsPlaysComponent extends DataViewComponent<Result> {
  @ViewChild('target') target: ElementRef;

  protected processData(result: Result): any {
    if (!result || !result.geekgames) return;
    const data = result.geekgames;
    const gameById: Record<string, GameResult> = {};
    for (const gd of data.games) gameById[gd.bggid] = gd;
    const chartData: ComplexityVsPlaysData[] = [];
    for (const gg of data.geekGames) {
      const game = gameById[gg.bggid];
      if (gg.plays > 0 && game.weight) {
        chartData.push({
          complexity: game.weight,
          plays: Math.min(gg.plays, 300),
          tooltip: gameById[gg.bggid].name,
          subdomain: gameById[gg.bggid].subdomain
        });
      }
    }
    this.displayChart(chartData);
  }

  private displayChart(values: ComplexityVsPlaysData[]): void {
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
        "type": "log",
        "base": 10,
        "nice": false,
        "range": "height",
        "domain": [1, 300]
      },
        SUBDOMAIN_COLOUR,
        SUBDOMAIN_SHAPE
      ],
      "axes": [
        {"orient": "bottom", "scale": "x", "zindex": 1, "title": "BGG Weight", "domain": false },
        {"orient": "left", "scale": "y", "zindex": 1, "title": "Your Plays", "domain": false, "grid": true }
      ],
      "marks": [{
        "type": "symbol",
        "from": {"data": "table"},
        "encode": {
          "enter": {
            "x": { "scale": "x", "field": "complexity"},
            "y": { "scale": "y", "field": "plays"},
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
