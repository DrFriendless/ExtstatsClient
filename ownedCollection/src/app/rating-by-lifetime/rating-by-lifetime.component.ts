import {Component, ElementRef, ViewChild} from '@angular/core';
import {DataViewComponent} from "extstats-angular";
import {Data, ymdToDate} from "../app.component";
import embed, {VisualizationSpec} from "vega-embed";
import {makeIndex, roundRating} from "extstats-core";

interface Item {
  lifetime: number;
  rating: number;
  tooltip: string;
  y: number;
}

@Component({
  selector: 'rating-by-lifetime',
  templateUrl: './rating-by-lifetime.component.html'
})
export class RatingByLifetimeComponent extends DataViewComponent<Data> {
  @ViewChild('target', {static: true}) target: ElementRef;

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

  protected processData(collection: Data) {
    if (!collection || !collection.geekGames) return;
    const gamesIndex = makeIndex(collection.games);
    const items: Item[] = [];
    collection.geekGames.forEach(gg => {
      const g = gamesIndex[gg.bggid];
      if (g && gg.rating > 0 && gg.firstPlay && gg.firstPlay !== gg.lastPlay) {
        const rating = roundRating(gg.rating);
        const fp = gg.firstPlay;
        const lp = gg.lastPlay;
        const fpd = ymdToDate(fp);
        const lpd = ymdToDate(lp);
        const daysBetween = Math.round((lpd.valueOf() - fpd.valueOf()) / 86400000);
        const tooltip = g.name + " " + fpd.toLocaleDateString() + " - " + lpd.toLocaleDateString() + ` (${gg.rating})`;
        items.push({
          rating,
          tooltip,
          lifetime: Math.min(daysBetween, 3650),
          y: 0
        });
      }
    });
    items.sort((a, b) => a.lifetime - b.lifetime);
    let y = 0;
    for (const i of items) i.y = y++;
    this.refreshChart(items);
  }

  private refreshChart(data: Item[]) {
    const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega/v5.7.3.json",
      "hconcat": [],
      "padding": 5,
      "title": "Ratings By Published Year of Games Owned",
      "width": 900,
      "height": 600,
      "data": [{
        "name": "table",
        "values": data
      }],
      "scales": [
        {
          "name": "x",
          "type": "linear",
          "range": "width",
          "domain": {"data": "table", "field": "lifetime"}
        },
        {
          "name": "y",
          "type": "linear",
          "range": "height",
          "domain": {"data": "table", "field": "y"}
        },
        {
          "name": "color",
          "type": "linear",
          "range": this.ALDIES_COLOURS,
          "domain": {"data": "table", "field": "rating"}
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
              "x": {"scale": "x", value: 0 },
              "x2": {"scale": "x", "field": "lifetime"},
              "y": {"scale": "y", "field": "y"},
              "y2": {"scale": "y", offset: 1},
              "fill": {"scale": "color", "field": "rating"},
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
