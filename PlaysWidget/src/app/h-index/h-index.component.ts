import {Component, computed, EventEmitter, input, OnInit, Signal, signal} from '@angular/core';
import {
  PlaysViewComponent
} from "extstats-angular";
import {Result} from "../app.component";
import {NgxSliderModule} from "@angular-slider/ngx-slider";
import {GeekSummary} from "extstats-api";
import {makeIndex} from "extstats-core";
import {NgClass, NgStyle} from "@angular/common";

interface Column {
  bggid: number;
  blank: number;
  previous: number;
  lastYear: number;
  tooltip: string;
  index: number;
  blankStart: number;
  blankEnd: number;
  lastStart: number;
  lastEnd: number;
  previousStart: number;
  previousEnd: number;
}

interface GamePlay {
  bggid: number;
  total: number;
  lastYear: number;
  name: string;
}

interface Processed {
  plays: GamePlay[];
}

@Component({
  selector: 'h-index',
  templateUrl: './h-index.component.html',
  standalone: true,
  imports: [
    NgxSliderModule,
    NgStyle,
    NgClass,
  ]
})
export class HIndexComponent extends PlaysViewComponent<Result> implements OnInit {
  geekData = input<GeekSummary | undefined>();
  data = signal<Result>({plays: { games: [], plays: [], geekgames: [] }});
  height = computed(() => this.hindex() + 10);
  hindex = computed(() => {
    const summary = this.geekData();
    if (!summary) return 0;
    return summary.warData?.hindex || 0;
  });
  processed: Signal<Processed> = computed(() => {
    const data = this.data();
    if (!data) return { plays: [], gameIndex: {} };
    const gameIndex = makeIndex(data.plays.games);
    const counts: Record<string, number> = {};
    const today = new Date();
    const yearAgo = ((today.getFullYear() - 1) * 10000) + ((today.getMonth() + 1) * 100) + today.getDate();
    const countsLastYear: Record<string, number> = {};
    for (const pd of data.plays.plays) {
      const v = counts[pd.bggid.toString()] || 0;
      counts[pd.bggid.toString()] = v + pd.quantity;
      const ymd = pd.year * 10000 + pd.month * 100 + pd.day;
      if (ymd >= yearAgo) {
        const v2 = countsLastYear[pd.bggid.toString()] || 0;
        countsLastYear[pd.bggid.toString()] = v2 + pd.quantity;
      }
    }
    const plays: GamePlay[] = [];
    for (const bggids in counts) {
      const bggid = parseInt(bggids);
      const total = counts[bggids];
      const lastYear = countsLastYear[bggids] || 0;
      const name = gameIndex[bggids].name;
      plays.push({ bggid, lastYear, total, name });
    }
    return { plays };
  });
  width = computed(() => {
    let plays = this.processed().plays;
    const height = this.height();
    return Math.min(plays.length, Math.max(100, height * 2));
  });
  columns: Signal<Column[]> = computed(() => {
    let plays = this.processed().plays;
    const height = this.height();
    const width = this.width();
    plays.sort((g1, g2) => {
      let cmp = g2.total - g1.total;
      if (cmp === 0) cmp = g2.lastYear - g1.lastYear;
      if (cmp === 0) cmp = g2.bggid - g1.bggid;
      return cmp;
    });
    if (plays.length > width) plays = plays.slice(0, width);
    return plays.map((g, index) => {
      let remaining = height;
      let previous = 0;
      let lastYear = 0;
      if (remaining > 0 && g.lastYear > 0) {
        const q = Math.min(remaining, g.lastYear);
        lastYear = q;
        remaining -= q;
      }
      if (remaining > 0 && g.total > g.lastYear) {
        const q = Math.min(remaining, g.total - g.lastYear);
        previous = q;
        remaining -= q;
      }
      const blank = remaining;
      const col: Column = { blank, lastYear, tooltip: `${g.name} ${g.total} total plays, ${g.lastYear} in the last year`, previous, bggid: g.bggid, index: index + 1,
        blankStart: 1, blankEnd: blank + 1, previousStart: blank + 1, previousEnd: blank + previous + 1, lastStart: blank + previous + 1, lastEnd: height + 1
      };
      return col;
    });
  });
  readonly fiddle = new EventEmitter<undefined>();

  ngOnInit(): void {
    this.fiddle.subscribe(junk => {
      this.recalc();
    });
  }

  private recalc() {

  }

  protected override processData(data: Result): void {
    this.data.set(data);
  }

  protected readonly JSON = JSON;
}
