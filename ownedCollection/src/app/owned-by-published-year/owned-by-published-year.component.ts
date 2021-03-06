import { Component, ViewChild, ElementRef } from '@angular/core';
import { DataViewComponent } from "extstats-angular";
import { makeIndex } from "extstats-core";
import { VisualizationSpec } from "vega-embed";
import embed from "vega-embed";
import { Data } from "../app.component";

type SingleYearData = {
  year: Date;
  y: number;
  colour: number;
  tooltip: string;
}

@Component({
  selector: 'owned-by-year-graph',
  templateUrl: './owned-by-published-year.component.html'
})
export class OwnedByPublishedYearComponent extends DataViewComponent<Data> {
  @ViewChild('target', {static: true}) target: ElementRef;
  public rows = [];
  private startYear = 1995;
  private readonly ALDIES_COLOURS = [
    '#ffffff',
    '#ff0000',
    '#ff3366',
    '#ff6699',
    '#ff66cc',
    '#cc99ff',
    '#9999ff',
    '#99ffff',
    '#66ff99',
    '#33cc99',
    '#00cc00'];

  private emptyData(): { [year: number]: { counts: number[], names: string[][] } } {
    const thisYear = (new Date()).getFullYear();
    const result = {};
    for (let y = this.startYear; y <= thisYear; y++) {
      result[y] = {
        counts: [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
        names: [ [], [], [], [], [], [], [], [], [], [], [] ] };
    }
    return result;
  }

  private static roundRatingOrZero(r: number): number {
    let rating = Math.round(r);
    if (rating < 1) rating = 0;
    if (rating > 10) rating = 10;
    return rating;
  }

  protected processData(collection: Data) {
    if (!collection || !collection.geekGames) return;
    const data = this.emptyData();
    const gamesIndex = makeIndex(collection.games);
    collection.geekGames.forEach(gg => {
      const g = gamesIndex[gg.bggid];
      if (g) {
        if (g.yearPublished >= this.startYear) {
          const rating = OwnedByPublishedYearComponent.roundRatingOrZero(gg.rating);
          data[g.yearPublished].counts[rating]++;
          data[g.yearPublished].names[rating].push(g.name);
        }
      }
    });
    this.refreshChart(data);
  }

  private refreshChart(data: { [year: number]: { counts: number[], names: string[][] } }) {
    const chartData: SingleYearData[] = [];
    for (const year in data) {
      for (let i = 1; i <= 10; i++) {
        const count = data[year].counts[i - 1];
        const names = data[year].names[i - 1];
        chartData.push({year: new Date(parseInt(year), 7), y: count, colour: i, tooltip: names.join(", ") });
      }
    }
    const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega/v5.7.3.json",
      "hconcat": [],
      "padding": 5,
      "title": "Ratings By Published Year of Games Owned",
      "width": 800,
      "height": 600,
      "data": [{
        "name": "table",
        "values": chartData,
        "transform": [
          {
            "type": "stack",
            "groupby": ["year"],
            "sort": {"field": "colour"},
            "field": "y"
          }
        ]
      }],
      "scales": [
        {
          "name": "x",
          "type": "band",
          "range": "width",
          "domain": {"data": "table", "field": "year"}
        },
        {
          "name": "y",
          "type": "linear",
          "range": "height",
          "nice": true, "zero": true,
          "domain": {"data": "table", "field": "y1"}
        },
        {
          "name": "color",
          "type": "ordinal",
          "range": this.ALDIES_COLOURS,
          "domain": {"data": "table", "field": "colour"}
        }
      ],
      "axes": [
        { "orient": "bottom", "scale": "x", "zindex": 1, "formatType": "time", "format": "%y" },
        { "orient": "left", "scale": "y", "zindex": 1 }
      ],
      "marks": [
        {
          "type": "rect",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "x": {"scale": "x", "field": "year"},
              "width": {"scale": "x", "band": 1, "offset": -1},
              "y": {"scale": "y", "field": "y0"},
              "y2": {"scale": "y", "field": "y1"},
              "fill": {"scale": "color", "field": "colour"},
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
