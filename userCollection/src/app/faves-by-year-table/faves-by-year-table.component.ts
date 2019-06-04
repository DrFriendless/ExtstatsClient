import { Component, OnDestroy, AfterViewInit, Input } from '@angular/core';
import { Collection, makeGamesIndex } from "extstats-core"
import { Observable } from "rxjs/internal/Observable";
import { Subscription } from "rxjs/internal/Subscription";

type FaveYearRow = { year: number, games: string[]; }

@Component({
  selector: 'faves-by-year-table',
  templateUrl: './faves-by-year-table.component.html'
})
export class FavesByYearTableComponent implements OnDestroy, AfterViewInit {
  @Input('data') data$: Observable<Collection>;
  private subscription: Subscription;
  public rows: FaveYearRow[] = [];

  constructor() { }

  public ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  public ngAfterViewInit() {
    this.subscription = this.data$.subscribe(collection => this.processData(collection));
  }

  private processData(collection: Collection) {
    this.rows = [];
    const byYear: Record<number, string[]> = {};
    const index = makeGamesIndex(collection.games);
    for (let gg of collection.collection) {
      if (gg.rating >= 8) {
        const game = index[gg.bggid];
        let games = byYear[game.yearPublished];
        if (!games) {
          games = [game.name];
          byYear[game.yearPublished] = games;
          this.rows.push({ year: game.yearPublished, games });
          this.rows.sort((y1,y2) => y1.year - y2.year);
        } else {
          games.push(game.name);
        }
      }
    }
  }

  private join(ss: string[]): string {
    return ss.join(", ");
  }
}
