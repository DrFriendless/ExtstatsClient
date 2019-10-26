import { Component, ViewChild, ElementRef, Input } from "@angular/core"
import { DataViewComponent } from "extstats-angular";
import { makeIndex } from "extstats-core"
import { VisualizationSpec } from "vega-embed";
import embed from "vega-embed";
import { Data } from "../app.component";

type GivenData = {
  plays: Bucket;
  expansion: boolean;
  names: string[];
  key: string;
};
type Bucket = {
  hi: number;
  lo: number;
  name: string;
};
type GraphData = {
  bucket: Bucket;
  bucketLo: number;
  count: number;
  tooltip: string;
  expansion: boolean;
  tickX?: number;
  url: string;
  key: string;
  colourCode: number;
  name: string;
};
type MarkData = {
  bucket: number;
  x: number;
};

function newBucket(lo: number, hi?: number) {
  if (!hi) hi = lo;
  const name = (lo === hi) ? `${lo}` : (hi > 1000) ? `${lo}+` : `${lo}-${hi}`;
  return { lo, hi, name };
}

const SINGLE_BUCKETS = 25;
const BUCKETS_TO_USE = Array
  .from(Array(SINGLE_BUCKETS).keys())
  .map(n => newBucket(n))
  .concat([ newBucket(25, 49), newBucket(50, 99), newBucket(100, 199), newBucket(200, 1000000) ]);

@Component({
  selector: 'extstats-pogo',
  templateUrl: './plays-of-games-owned.component.html'
})
export class PlaysOfGamesOwnedComponent extends DataViewComponent<Data> {
  @Input() geek: string;
  @ViewChild('target', {static: true}) target: ElementRef;
  private readonly COLOURS = [
    '#D2691E',
    '#FFA500',
    '#4682B4',
    '#00BFFF'
  ];

  private newGraphData(bucket: Bucket, expansion: boolean): GraphData {
    const url = (bucket.lo === 0 && `https://boardgamegeek.com/collection/user/${this.geek}?own=1&played=0`) ||
      `https://boardgamegeek.com/collection/user/${this.geek}?own=1&minplays=${bucket.lo}&maxplays=${bucket.hi}`;
    return {
      bucket, count: 0, bucketLo: bucket.lo, name: bucket.name,
      tooltip: "", url, expansion,
      key: bucket.lo.toString() + "-" + expansion,
      colourCode: (bucket.lo >= 10 ? 2 : 0) + (expansion ? 0 : 1),
    };
  }

  private newData(bucket: Bucket, expansion: boolean): GivenData {
    return { plays: bucket, expansion, names: [], key: bucket.lo.toString() + "-" + expansion };
  }

  protected processData(collection: Data) {
    if (!collection || !collection.geekGames) return;
    const givenDataByKey: Record<string, GivenData> = {};
    const gamesIndex = makeIndex(collection.games);
    const countByLo: Record<number, number> = {};
    let tens = 0;
    let anyExpansions = false;
    collection.geekGames.forEach(gg => {
      const bucket = calcPlaysBucket(gg.plays);
      if (bucket.lo >= 10) tens++;
      if (!countByLo[bucket.lo]) {
        countByLo[bucket.lo] = 1;
      } else {
        countByLo[bucket.lo]++;
      }
      const game = gamesIndex[gg.bggid];
      const key = bucket.lo.toString() + "-" + game.isExpansion;
      const data = givenDataByKey[key] || this.newData(bucket, game.isExpansion);
      anyExpansions = anyExpansions || game.isExpansion;
      givenDataByKey[key] = data;
      data.names.push(game.name);
    });
    // figure out where the mark goes
    let markData = { bucket: 0, x: 0 };
    const los = Object.keys(countByLo);
    for (const lo of los) {
      const count = countByLo[lo] || 0;
      if (count <= tens) {
        tens -= count;
      } else {
        markData.bucket = parseInt(lo);
        markData.x = tens;
        break;
      }
    }
    // populate the buckets
    const data = Object.values(givenDataByKey);
    const result: GraphData[] = [];
    const gdByKey: Record<string, GraphData> = {};
    BUCKETS_TO_USE.forEach(bucket => {
      const gd = this.newGraphData(bucket, false);
      gdByKey[gd.key] = gd;
      result.push(gd);
      if (anyExpansions) {
        const gde = this.newGraphData(bucket, true);
        gdByKey[gde.key] = gde;
        result.push(gde);
      }
    });
    data.forEach(d => {
      const gd = gdByKey[d.key];
      gd.count = d.names.length;
      gd.tooltip = d.names.join(", ");
    });
    result.sort((a, b) => (a.bucketLo - b.bucketLo) * 10 + (a.expansion ? 0 : 1) - (b.expansion ? 0 : 1));
    this.refreshChart(result, markData);
  }

  private refreshChart(data: GraphData[], markData: MarkData) {
    const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega/v5.7.3.json",
      "hconcat": [],
      "padding": 5,
      "title": "Plays of Games Owned",
      "width": 800,
      "height": 600,
      "data": [{
        "name": "table",
        "values": data,
        "transform": [
          {
            "type": "stack",
            "groupby": ["bucketLo"],
            "sort": {"field": "expansion"},
            "field": "count",
            "as": ["count0", "count1"]
          }
        ]
      }],
      "scales": [
        {
          "name": "x",
          "type": "linear",
          "range": "width",
          "zero": true,
          "domain": {"data": "table", "field": "count1"}
        },
        {
          "name": "y",
          "type": "band",
          "range": "height",
          "zero": true,
          "reverse": true,
          "domain": {"data": "table", "field": "name"},
          "padding": 0.15
        },
        {
          "name": "color",
          "type": "ordinal",
          "range": this.COLOURS,
          "domain": {"data": "table", "field": "colourCode"}
        }
      ],
      "axes": [
        {
          "orient": "bottom",
          "scale": "x", "zindex": 1,
          "title": "Number of Games"
        },
        {
          "orient": "left",
          "scale": "y",
          "zindex": 1,
          "title": "Plays",
        }
      ],
      "marks": [
        {
          "type": "rect",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "y": {"scale": "y", "field": "name"},
              "height": {"scale": "y", "band": 1 },
              "x": {"scale": "x", "field": "count0"},
              "x2": {"scale": "x", "field": "count1"},
              "fill": {"scale": "color", "field": "colourCode"},
              "stroke": { "value": "black" },
              "strokeWidth": { "value": 1 },
              "tooltip": {"field": "tooltip"},
              "href": {"field": "url"}
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
          "type": "rect",
          "encode": {
            "enter": {
              "x": { "scale": "x", "value": markData.x },
              "y": { "scale": "y", "value": markData.bucket },
              "height": { "scale": "y", "band": 1 },
              "width": { "value": 4 },
              "fill": { "value": "#00FF7F" },
              "tooltip": { "value": "Friendless Metric" }
            }
          }
        }
      ]
    };
    embed(this.target.nativeElement, spec, { actions: true });
  }
}

function calcPlaysBucket(plays: number): Bucket {
  if (plays < SINGLE_BUCKETS) return BUCKETS_TO_USE[plays];
  return BUCKETS_TO_USE.slice(SINGLE_BUCKETS).filter(b => plays >= b.lo && plays <= b.hi)[0];
}
