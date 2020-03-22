import {Component, ElementRef, ViewChild} from '@angular/core';
import {PlaysViewComponent} from "extstats-angular";
import {Result} from "../app.component";
import embed, {VisualizationSpec} from "vega-embed";
import {makeIndex} from "extstats-core";
import {Counter} from "../library";

interface Row {
  plays: number;
  name: string;
  id: number;
}

@Component({
  selector: 'mike-hulsebus',
  templateUrl: './mike-hulsebus.component.html',
  styleUrls: ['./mike-hulsebus.component.scss']
})
export class MikeHulsebusComponent extends PlaysViewComponent<Result> {
  @ViewChild('target', {static: true}) target: ElementRef;

  private MIKE_HULSEBUS_COLOURS = ["#ff420e", "#ffd320", "#569d1b", "#7d0020", "#83cafe", "#324005", "#aed000",
    "#4a1f6f", "#fd950e", "#c5000a", "#0083d1", "#004586" ];
  private MAX = 100;

  protected processData(data: Result): any {
    if (!data || !data.plays || !data.plays.geeks || !data.plays.geeks.length) return;
    const gamesIndex = makeIndex(data.plays.games);
    const counter = new Counter();
    for (const p of data.plays.plays) {
      if (gamesIndex[p.game].isExpansion) continue;
      counter.add(p.game, p.quantity);
    }
    const desc = counter.desc();
    const rows: Row[] = [];
    let id;
    for (id=0; id<desc.length && id<this.MAX; id++) {
        const plays = counter.get(desc[id]);
        rows.push({ plays, name: gamesIndex[desc[id]].name + ` (${plays})`, id });
    }
    if (desc.length > this.MAX) {
      let other = 0;
      for (let i=this.MAX; i<desc.length; i++) {
        other += counter.get(desc[i]);
      }
      rows.push({ plays: other, name: `(other) (${other})`, id });
    }
    this.refreshChart(rows);
  }

  private refreshChart(data: Row[]) {
    const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega/v5.7.3.json",
      "hconcat": [],
      "padding": 5,
      "title": "Your Most Played Games",
      "width": 600,
      "height": 600,
      "signals": [
        { "name": "startAngle", "value": 0 },
        { "name": "endAngle", "value": 6.283 },
        { "name": "padAngle", "value": 0 },
        { "name": "innerRadius", "value": 0 },
        { "name": "cornerRadius", "value": 10 },
        { "name": "sort", "value": false }
      ],
      "scales": [
        {
          "name": "colour",
          "type": "ordinal",
          "range": this.MIKE_HULSEBUS_COLOURS
        }
      ],

      "marks": [
        {
          "type": "arc",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "fill": {"scale": "colour", "field": "id"},
              "x": {"signal": "width / 2"},
              "y": {"signal": "height / 2"},
              "tooltip": {"field": "name" }
            },
            "update": {
              "startAngle": {"field": "startAngle"},
              "endAngle": {"field": "endAngle"},
              "padAngle": {"signal": "padAngle"},
              "innerRadius": {"signal": "innerRadius"},
              "outerRadius": {"signal": "width / 2"},
              "cornerRadius": {"signal": "cornerRadius"},
              "fillOpacity": {"value": 1}
            },
            "hover": {
              "fillOpacity": {"value": 0.5}
            }
          }
        }
      ],
      "data": [{
        "name": "table",
        "values": data,
        "transform": [{
          "type": "pie",
          "field": "plays",
          "startAngle": {"signal": "startAngle"},
          "endAngle": {"signal": "endAngle"},
          "sort": {"signal": "sort"}
        }]
      }]
    };
    embed(this.target.nativeElement, spec, { actions: true });
  }
}
