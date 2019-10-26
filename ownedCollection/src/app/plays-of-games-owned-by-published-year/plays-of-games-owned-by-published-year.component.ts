import { Component, ElementRef, ViewChild } from '@angular/core';
import { DataViewComponent } from "extstats-angular";
import { makeIndex } from "extstats-core";
import embed, { VisualizationSpec } from "vega-embed";
import { Data } from "../app.component";

const RED = "#ff0000";
const ORANGE = "#ff8800";
const YELLOW = "#ffff00";
const GREEN = "#00ff00";
const DARKGREEN = "#00bb00";
const WHITE = "#ffffff";
const YELLOWGREEN = "#aaff00";

type SingleGameData = {
  name: string;
  colour: number;
  plays: number;
  tooltip: string;
  y: number;
  x: number;
};

@Component({
  selector: 'pogo-by-published-year',
  templateUrl: './plays-of-games-owned-by-published-year.component.html'
})
export class PlaysOfGamesOwnedByPublishedYearComponent extends DataViewComponent<Data> {
  @ViewChild('target', {static: true}) target: ElementRef;
  public rows = [];
  private startYear = 1995;
  private readonly PBPY_COLOURS = [
    WHITE, RED, ORANGE, YELLOW, YELLOWGREEN, GREEN, DARKGREEN
  ];

  private emptyData(): Record<string, SingleGameData[]> {
    const thisYear = (new Date()).getFullYear();
    const result = {};
    for (let y = this.startYear; y <= thisYear; y++) {
      result[y] = [];
    }
    return result;
  }

  protected processData(collection: Data) {
    if (!collection || !collection.geekGames) return;
    const data = this.emptyData();
    const gamesIndex = makeIndex(collection.games);
    collection.geekGames.forEach(gg => {
      const g = gamesIndex[gg.bggid];
      if (g) {
        if (g.yearPublished >= this.startYear) {
          const plays = gg.plays;
          const d: SingleGameData = {
            name: g.name, plays, tooltip: `${g.name} (${plays} plays)`, colour: calcColour(plays),
            y: 0, x: g.yearPublished
          };
          data[g.yearPublished].push(d);
        }
      }
    });
    const allData = [];
    for (const year of Object.keys(data)) {
      const ygs = data[year];
      ygs.sort((a, b) => {
        let c = a.plays - b.plays;
        if (c !== 0)  return c;
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
      });
      let i = 0;
      for (let yg of ygs) {
        yg.y = i++;
        allData.push(yg);
      }
    }
    this.refreshChart(allData);
  }

  private refreshChart(data: SingleGameData[]) {
    const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega/v5.7.3.json",
      "hconcat": [],
      "padding": 5,
      "title": "Plays of Games Owned by Published Year",
      "width": 600,
      "height": 600,
      "data": [{
        "name": "table",
        "values": data
      }],
      "scales": [
        {
          "name": "x",
          "type": "band",
          "range": "width",
          "domain": {"data": "table", "field": "x"}
        },
        {
          "name": "y",
          "type": "band",
          "reverse": true,
          "range": "height",
          "nice": true, "zero": true,
          "domain": {"data": "table", "field": "y"}
        },
        {
          "name": "colour",
          "type": "linear",
          "range": this.PBPY_COLOURS,
          "domain": {"data": "table", "field": "colour"}
        }
      ],
      "axes": [
        {"orient": "bottom", "scale": "x", "zindex": 1},
        {"orient": "left", "scale": "y", "zindex": 1}
      ],
      "marks": [
        {
          "type": "rect",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "x": {"scale": "x", "field": "x"},
              "width": {"scale": "x", "band": 1, "offset": -1},
              "y": {"scale": "y", "field": "y"},
              "height": {"scale": "y", "band": 1, "offset": -1},
              "fill": {"scale": "colour", "field": "colour"},
              "stroke": { "value": "black" },
              "strokeWidth": { "value": 1 },
              "tooltip": {"field": "tooltip"}
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

function calcColour(plays: number): number {
  if (plays === 0) return 0;
  if (plays === 1) return 1;
  if (plays < 3) return 2;
  if (plays < 5) return 3;
  if (plays < 10) return 4;
  if (plays < 25) return 5;
  return 6;
}
