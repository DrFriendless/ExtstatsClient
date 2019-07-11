import { Component, ViewChild, ElementRef } from '@angular/core';
import { PlaysViewComponent } from "extstats-angular";
import { makeGamesIndex } from "extstats-core";
import { VisualizationSpec } from "vega-embed";
import embed from "vega-embed";
import { HasYMD, PlaysData, Result } from "../app.component"

@Component({
  selector: 'new-plays',
  templateUrl: './new-plays.component.html'
})
export class NewPlaysComponent extends PlaysViewComponent<Result> {
  private KELLY_COLOURS = ['#F3C300', '#875692', '#F38400', '#A1CAF1', '#BE0032', '#C2B280', '#848482',
    '#008856', '#E68FAC', '#0067A5', '#F99379', '#604E97', '#F6A600', '#B3446C', '#DCD300', '#882D17', '#8DB600',
    '#654522', '#E25822', '#222222', '#2B3D26'];
  @ViewChild('target') target: ElementRef;

  private star = "M0,0.2L0.2351,0.3236 0.1902,0.0618 0.3804,-0.1236 0.1175,-0.1618 0,-0.4 -0.1175,-0.1618 -0.3804,-0.1236 -0.1902,0.0618 -0.2351,0.3236 0,0.2Z";

  protected processData(plays: Result) {
    this.refreshChart(plays.plays);
  }

  private static compareDate(d1: HasYMD, d2: HasYMD): number {
    if (d1 < d2) return -1;
    if (d1 > d2) return 1;
    return 0;
  }

  private refreshChart(data: PlaysData) {
    if (!data || !data.games) return;
    const firstPlays: ChartPlay[] = [];
    const alreadyPlayedByGeek: { [geek: string]: number[] } = {};
    const gamesIndex = makeGamesIndex(data.games);
    for (const geek of data.geeks) {
      const plays = data.plays.filter(p => p.geek === geek);
      if (!alreadyPlayedByGeek[geek]) alreadyPlayedByGeek[geek] = [];
      const playedByThisGeek = alreadyPlayedByGeek[geek];
      plays.sort((p1, p2) => NewPlaysComponent.compareDate(p1, p2));
      let first = true;
      for (const play of plays) {
        if (playedByThisGeek.indexOf(play.game) >= 0) continue;
        play.year = Math.floor(play.ymd / 10000);
        play.month = Math.floor(play.ymd / 100) % 100;
        play.date = play.ymd % 100;
        playedByThisGeek.push(play.game);
        if (play.year >= 1996) {
          if (first) {
            firstPlays.push({
              count: playedByThisGeek.length,
              gameName: "Before 1996",
              playDate: new Date(1996, 0, 1).getTime(),
              geek
            });
            first = false;
          }
          const game = gamesIndex[play.game];
          firstPlays.push({
            count: playedByThisGeek.length,
            gameName: game.name,
            playDate: new Date(play.year, play.month - 1, play.date).getTime(),
            geek
          });
        }
      }
      console.log(firstPlays);
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
            "name": "shape",
            "type": "ordinal",
            "domain": data.geeks,
            "range": ['circle', 'square', "cross", 'diamond', 'triangle-up', 'triangle-down', 'triangle-right', "triangle-left", this.star ]
          }, {
            "name": "colour",
            "type": "ordinal",
            "domain": data.geeks,
            "range": this.KELLY_COLOURS
          }
        ],
        "axes": [
          {"orient": "bottom", "scale": "xscale", "zindex": 1},
          {"orient": "left", "scale": "yscale", "zindex": 1}
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
          }
        ],
        "legends": [{
          "direction": "vertical",
          "type": "symbol",
          "stroke": "colour",
          "shape": "shape"
        }]
      };
      embed(this.target.nativeElement, spec, { actions: true });
    }
  }
}

interface ChartPlay {
  count: number;
  gameName: string;
  playDate: number;
  geek: string;
}
