import {Component, ElementRef, ViewChild} from '@angular/core';
import {PlaysViewComponent} from "extstats-angular";
import {Result} from "../app.component";
import {makeIndex} from "extstats-core";
import embed, {VisualizationSpec} from "vega-embed";

const FLORENCE_COLOURS = { 'Abstract Games': '#20b020', 'cgs': '#d060d0', 'Unknown': '#aaaaaa',
  'Children\'s Games' : '#f0d000', 'Family Games': '#20d0d0', 'Party Games': '#f02020',
  'Strategy Games': '#4381b2', 'Thematic Games' : '#fab6b6', 'Wargames' : '#BDB76B', 'Customizable Games' : "#A4C639" };

interface ChartData {
  name: string;
  startAngle: number;
  endAngle: number;
  radius: number;
  colour: string;
  tooltip: string;
  zindex: number;
}

@Component({
  selector: 'florence-nightingale',
  templateUrl: './florence-nightingale.component.html'
})
export class FlorenceNightingaleComponent extends PlaysViewComponent<Result> {
  @ViewChild('target', {static: true}) target: ElementRef;

  protected processData(d: Result) {
    if (!d || !d.plays || !d.plays.games || !d.plays.plays) return;
    const data = d.plays;
    const gi = makeIndex(data.games);
    const playsBySubdomain: Record<string, number> = {};
    const playsByGame: Record<string, number> = {};
    for (const play of data.plays) {
      const game = gi[play.game];
      if (!game || !game.subdomain) continue;
      playsBySubdomain[game.subdomain] = (playsBySubdomain[game.subdomain] || 0) + play.quantity;
      playsByGame[play.game] = (playsByGame[play.game] || 0) + play.quantity;
    }
    if (playsBySubdomain.size === 0) return;
    const mostPlayedGames: { bggid: number, count: number, subdomain: string }[] = [];
    for (const bggid in playsByGame) {
      mostPlayedGames.push({ bggid: parseInt(bggid), count: playsByGame[bggid], subdomain: gi[bggid].subdomain });
    }
    mostPlayedGames.sort((a, b) => b.count - a.count);
    mostPlayedGames.splice(30);
    mostPlayedGames.reverse();
    const chartData: ChartData[] = [];
    let start = 0;
    const perSubdomain = 6.283 / Object.values(playsBySubdomain).length;
    const padding = perSubdomain / 20;
    for (const key in playsBySubdomain) {
      const count = playsBySubdomain[key];
      chartData.push({
        name: key,  radius: Math.sqrt(count),
        startAngle: start + padding, endAngle: start + perSubdomain - padding,
        colour: FLORENCE_COLOURS[key] || "#000000", "tooltip": `${key} (${count})`, zindex: 0
      });
      let total = 0;
      const sub: ChartData[] = [];
      for (const g of mostPlayedGames.filter(g => g.subdomain === key)) {
        const name = gi[g.bggid].name;
        const item = { name: "", radius: Math.sqrt(total + g.count),
          startAngle: start + padding, endAngle: start + perSubdomain - padding,
          colour: "#000000", "tooltip": `${name} (${g.count})`, zindex: 0
        };
        sub.push(item);
        total += g.count;
      }
      sub.reverse();
      let zindex = 0;
      let col = FLORENCE_COLOURS[key];
      for (const item of sub) {
        col = adjust(col, -10);
        item.colour = col;
        item.zindex = zindex++;
        chartData.push(item);
      }
      start += perSubdomain;
    }
    this.displayChart(chartData);
  }



  private displayChart(chartData: ChartData[]): void {
    const spec: VisualizationSpec = {
      "$schema": "https://vega.github.io/schema/vega/v5.7.3.json",
      "hconcat": [],
      "padding": 5,
      "title": "Florence Nightingale Diagram",
      "width": 800,
      "height": 800,
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
          "range": [0, 400]
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

