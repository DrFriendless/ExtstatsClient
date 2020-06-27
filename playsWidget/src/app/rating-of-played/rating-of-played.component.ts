import {Component, ElementRef, EventEmitter, OnInit, ViewChild} from '@angular/core';
import {Options} from "ng5-slider";
import {DataViewComponent} from "extstats-angular";
import {GameData, GeekGameData, PlaysData, Result} from "../app.component";
import {makeIndex, roundRating} from "extstats-core";
import embed, {VisualizationSpec} from "vega-embed";

interface ChartData {
  name: string;
  startAngle: number;
  endAngle: number;
  radius: number;
  colour: string;
  tooltip: string;
  zindex: number;
}

interface PlaysByGame {
  plays: number;
  game: number;
  rating: number;
}

const ALDIES_COLOURS = [
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

@Component({
  selector: 'rating-of-played',
  templateUrl: './rating-of-played.component.html'
})
export class RatingOfPlayedComponent extends DataViewComponent<Result> implements OnInit {
  @ViewChild('target') target: ElementRef;
  private readonly thisYear = new Date().getFullYear();
  private data: PlaysData;
  private gameIndex: Record<string, GameData>;
  private geekGameIndex: Record<string, GeekGameData>;
  readonly widthOptions: Options = { floor: 300, ceil: 2000, step: 100, showTicks: true, showTicksValues: true };
  readonly playsOptions: Options = { floor: 1980, ceil: this.thisYear, step: 1, showTicks: true, showTicksValues: true,
    translate: (value: number) => value.toString().slice(2) };
  readonly howManyOptions: Options = { floor: 4, ceil: 50, step: 2, showTicks: true, showTicksValues: true };
  readonly fiddle = new EventEmitter<any>();
  PLAYS_LO = 2005;
  PLAYS_HI = this.thisYear;
  width = 600;
  howMany = 30;

  ngOnInit(): void {
    this.fiddle.subscribe(junk => {
      this.recalc();
    });
  }

  protected processData(result: Result): any {
    this.data = result.plays;
    this.gameIndex = makeIndex(this.data.games);
    this.geekGameIndex = makeIndex(this.data.geekgames);
    this.fiddle.next(undefined);
  }

  private recalc(): void {
    const playsByRating: Record<string, number> = {};
    const playsByGameByRating: Record<string, Record<string, number>> = {};
    let totalPlays = 0;
    for (const play of this.data.plays) {
      if (play.year < this.PLAYS_LO || play.year > this.PLAYS_HI) continue;
      const game = this.gameIndex[play.game];
      const gg = this.geekGameIndex[play.game];
      if (!game || !gg || gg.rating <= 0) continue;
      const r = roundRating(gg.rating);
      if (r < 1) continue;
      playsByRating[r] = (playsByRating[r] || 0) + play.quantity;
      const pbgbr = playsByGameByRating[r] || {};
      pbgbr[play.game] = (pbgbr[play.game] || 0) + play.quantity;
      playsByGameByRating[r] = pbgbr;
      totalPlays += play.quantity;
    }
    if (totalPlays === 0) return;
    const topCandidates: PlaysByGame[] = [];
    for (const r in playsByGameByRating) {
      const pbg = playsByGameByRating[r];
      if (!pbg) continue;
      for (const g in pbg) {
        const p = pbg[g];
        if (!p) continue;
        topCandidates.push({ game: parseInt(g), plays: p, rating: parseInt(r) });
      }
    }
    topCandidates.sort((a, b) => b.plays - a.plays);
    if (topCandidates.length > this.howMany) topCandidates.splice(this.howMany);

    const chartData: ChartData[] = [];
    let playsSoFar = 0;
    for (const rating of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) {
      const plays = playsByRating[rating];
      if (!plays) continue;
      const startAngle = Math.PI * 2 * playsSoFar / totalPlays;
      const endAngle = Math.PI * 2 * (playsSoFar + plays) / totalPlays;
      chartData.push({ startAngle, endAngle, zindex: 0, tooltip: `Rating ${rating} - ${plays} plays`, colour: ALDIES_COLOURS[rating-1],
        name: `Rating ${rating}`, radius: this.width/2
      });
      const candidates = topCandidates.filter(c => c.rating === rating);
      candidates.sort((c1, c2) => c1.plays - c2.plays);
      const sub: ChartData[] = [];
      let subSoFar = 0;
      for (const candidate of candidates) {
        subSoFar += candidate.plays;
        const game = this.gameIndex[candidate.game];
        sub.push({ startAngle, endAngle, zindex: 0, tooltip: `${game.name} - ${candidate.plays} plays`,
          colour: "#000000", radius: this.width/2 * Math.sqrt(subSoFar / plays), name: undefined });
      }
      sub.reverse();
      let zindex = 0;
      let col = ALDIES_COLOURS[rating - 1];
      for (const item of sub) {
        col = adjust(col, -10);
        item.colour = col;
        item.zindex = zindex++;
        chartData.push(item);
      }
      playsSoFar += plays;
    }
    this.displayChart(chartData);
  }

  private displayChart(chartData: ChartData[]): void {
    console.log(chartData);
    const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega/v5.7.3.json",
      "hconcat": [],
      "padding": 5,
      "title": "Rating of Games Played",
      "width": this.width,
      "height": this.width,
      "data": [{
        "name": "table",
        "values": chartData
      }],
      "scales": [
        {
          "name": "r",
          "type": "linear",
          "domain": { "data": "table", "field": "radius" },
          "zero": true,
          "range": [0, this.width/2]
        }
      ],
      "marks": [
        {
          "type": "arc",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "x": {"field": {"group": "width"}, "mult": 0.5},
              "y": {"field": {"group": "height"}, "mult": 0.5},
              "startAngle": {"field": "startAngle"},
              "endAngle": {"field": "endAngle"},
              "innerRadius": {"value": 0},
              "outerRadius": {"scale": "r", "field": "radius"},
              "stroke": {"value": "#fff"},
              "tooltip": { "field": "tooltip" },
              "zindex": { "field": "zindex" }
            },
            "update": {
              "fill": { "field": "colour" }
            },
            "hover": {
              "fill": {"value": "pink"}
            }
          }
        },
        {
          "type": "text",
          "from": {"data": "table"},
          "encode": {
            "enter": {
              "x": {"field": {"group": "width"}, "mult": 0.5},
              "y": {"field": {"group": "height"}, "mult": 0.5},
              "radius": {"scale": "r", "field": "radius", "offset": 8},
              "theta": {"signal": "(datum.startAngle + datum.endAngle)/2"},
              "fill": {"value": "#000"},
              "align": {"value": "center"},
              "baseline": {"value": "middle"},
              "text": {"field": "name"}
            }
          }
        }
      ]
    };
    embed(this.target.nativeElement, spec, { actions: true });
  }
}

function adjust(color, amount) {
  return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}
