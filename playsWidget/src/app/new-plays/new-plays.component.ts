import {Component, ViewChild, ElementRef, Input} from '@angular/core';
import { PlaysViewComponent } from "extstats-angular";
import { makeIndex} from "extstats-core";
import { VisualizationSpec } from "vega-embed";
import embed from "vega-embed";
import { compareDate } from "../library"
import {Result} from "../app.component";

@Component({
  selector: 'new-plays',
  templateUrl: './new-plays.component.html'
})
export class NewPlaysComponent extends PlaysViewComponent<Result> {
  @ViewChild('target', {static: true}) target: ElementRef;

  private star = "M0,0.2L0.2351,0.3236 0.1902,0.0618 0.3804,-0.1236 0.1175,-0.1618 0,-0.4 -0.1175,-0.1618 -0.3804,-0.1236 -0.1902,0.0618 -0.2351,0.3236 0,0.2Z";

  protected processData(d: Result) {
    if (!d || !d.plays || !d.plays.games || !d.plays.plays) return;
    const data = d.plays;
    const firstPlays: ChartPlay[] = [];
    const playedByThisGeek: number[] = [];
    const gamesIndex = makeIndex(data.games);
    const plays = data.plays;
    const playedByYear: Record<number, number[]> = {};
    plays.sort((p1, p2) => compareDate(p1, p2));
    let first = true;
    const countByYear: Record<number, number> = {};
    plays.forEach(p => countByYear[p.year] = 0);
    plays.forEach(p => countByYear[p.year] += p.quantity);
    const lotsYears = Object.keys(countByYear).filter(y => countByYear[y] >= 12);
    let firstYear = Math.min(...lotsYears.map(y => parseInt(y)));
    if (firstYear < 1996) firstYear = 1996;
    for (const play of plays) {
      if (playedByThisGeek.indexOf(play.game) >= 0) continue;
      playedByThisGeek.push(play.game);
      if (play.year >= firstYear) {
        const playedThisYear = playedByYear[play.year] || [];
        playedByYear[play.year] = playedThisYear;
        playedThisYear.push(play.year);
        if (first) {
          firstPlays.push({
            count: playedByThisGeek.length,
            gameName: "Before " + firstYear,
            playDate: new Date(firstYear, 0, 1).getTime(),
            yearCount: playedThisYear.length
          });
          first = false;
        }
        const game = gamesIndex[play.game];
        firstPlays.push({
          count: playedByThisGeek.length,
          gameName: game.name,
          playDate: new Date(play.year, play.month - 1, play.day).getTime(),
          yearCount: playedThisYear.length
        });
      }
    }
    const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega/v5.7.3.json",
      "hconcat": [],
      "padding": 5,
      "title": "First Plays",
      "width": 900,
      "height": 600,
      "data": [{
        "name": "table",
        "values": firstPlays
      }],
      "scales": [
        {
          "name": "xscale",
          "type": "time",
          "range": "width",
          "domain": { "data": "table", "field": "playDate" }
        }, {
          "name": "yscale",
          "type": "linear",
          "range": "height",
          "zero": true,
          "domain": { "data": "table", "field": "count" }
        }, {
          "name": "yearScale",
          "type": "linear",
          "range": "height",
          "zero": true,
          "domain": { "data": "table", "field": "yearCount" }
        }
      ],
      "axes": [
        { "orient": "bottom", "scale": "xscale", "zindex": 1, title: "First Play Date" },
        { "orient": "left", "scale": "yscale", "zindex": 1, title: "Ever" },
        { "orient": "right", "scale": "yearScale", "zindex": 1, title: "By Year" }
      ],
      "marks": [
        {
          "type": "symbol",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "x": { "scale": "xscale", "field": "playDate"},
              "y": { "scale": "yscale", "field": "count"},
              "tooltip": {"field": "gameName" },
              "stroke": { "value": '#cdda49' },
              "shape": { "value": "circle" },
              "strokeWidth": { "value": 1 },
              "size": { "value": 16 }
            },
            "update": {
              "fillOpacity": {"value": 1}
            },
            "hover": {
              "fillOpacity": {"value": 0.5}
            }
          }
        },
        {
          "type": "symbol",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "x": { "scale": "xscale", "field": "playDate"},
              "y": { "scale": "yearScale", "field": "yearCount"},
              "tooltip": {"field": "gameName"},
              "stroke": { "value": '#673fb4' },
              "shape": { "value": this.star },
              "strokeWidth": { "value": 1 },
              "size": { "value": 16 }
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

interface ChartPlay {
  count: number;
  gameName: string;
  playDate: number;
  yearCount: number;
}
