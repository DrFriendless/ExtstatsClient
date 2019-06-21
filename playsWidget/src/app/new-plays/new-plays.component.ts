import { Component, ViewChild, ElementRef } from '@angular/core';
import { PlaysViewComponent } from "extstats-angular";
import { makeGamesIndex, MultiGeekPlays } from "extstats-core";
import { VisualizationSpec } from "vega-embed";
import embed from "vega-embed";
import { compareDate } from "../library"

@Component({
  selector: 'new-plays',
  templateUrl: './new-plays.component.html'
})
export class NewPlaysComponent extends PlaysViewComponent<MultiGeekPlays> {
  @ViewChild('target') target: ElementRef;

  private star = "M0,0.2L0.2351,0.3236 0.1902,0.0618 0.3804,-0.1236 0.1175,-0.1618 0,-0.4 -0.1175,-0.1618 -0.3804,-0.1236 -0.1902,0.0618 -0.2351,0.3236 0,0.2Z";

  protected processData(plays: MultiGeekPlays) {
    this.refreshChart(plays);
  }

  private refreshChart(data: MultiGeekPlays) {
    if (!data || !data.games || !data.geeks || !data.geeks.length) return;
    const firstPlays: ChartPlay[] = [];
    const playedByThisGeek: number[] = [];
    const gamesIndex = makeGamesIndex(data.games);
    const geek = data.geeks[0];
    const plays = data.plays[geek];
    const playedByYear: Record<number, number[]> = {};
    plays.sort((p1, p2) => compareDate(p1, p2));
    let first = true;
    for (const play of plays) {
      if (playedByThisGeek.indexOf(play.game) >= 0) continue;
      playedByThisGeek.push(play.game);
      if (play.year >= 1996) {
        const playedThisYear = playedByYear[play.year] || [];
        playedByYear[play.year] = playedThisYear;
        playedThisYear.push(play.year);
        if (first) {
          firstPlays.push({
            count: playedByThisGeek.length,
            gameName: "Before 1996",
            playDate: new Date(1996, 0, 1).getTime(),
            yearCount: playedThisYear.length,
            geek
          });
          first = false;
        }
        const game = gamesIndex[play.game];
        firstPlays.push({
          count: playedByThisGeek.length,
          gameName: game.name,
          playDate: new Date(play.year, play.month - 1, play.date).getTime(),
          yearCount: playedThisYear.length,
          geek
        });
      }
    }
    const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega/v4.json",
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
        }, {
          "name": "shape",
          "type": "ordinal",
          "domain": data.geeks,
          "range": [ 'circle', 'square', 'diamond', 'triangle-up', 'triangle-down', 'triangle-right', "triangle-left" ]
        }, {
          "name": "colour",
          "type": "ordinal",
          "domain": data.geeks,
          "range": [ '#cdda49' ]
        }, {
          "name": "yearShape",
          "type": "ordinal",
          "domain": data.geeks,
          "range": [ this.star ]
        }, {
          "name": "yearColour",
          "type": "ordinal",
          "domain": data.geeks,
          "range": [ '#673fb4', '#e62565', "#159588", '#fd9727', '#fc5830', '#8cc152' ]
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
              "tooltip": {"field": "gameName", "type": "quantitative"},
              "stroke": { "field": "geek", "scale": "colour" },
              "shape": { "field": "geek", "scale": "shape" },
              "strokeWidth": { "value": 1 },
              "size": 16
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
              "tooltip": {"field": "gameName", "type": "quantitative"},
              "stroke": { "field": "geek", "scale": "yearColour" },
              "shape": { "field": "geek", "scale": "yearShape" },
              "strokeWidth": { "value": 1 },
              "size": 16
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
  geek: string;
  yearCount: number;
}
