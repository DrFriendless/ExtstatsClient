import {Component, ViewChild} from "@angular/core"
import {
  GraphQuerySourceComponent,
  LoaderComponent,
  SelectorComboComponent,
  UserConfigService,
} from 'extstats-angular';
import {Observable} from "rxjs";
import {indexPlays, PlayAndGamesIndex} from "./play-index";
import {map, share} from "rxjs/operators";
import {ExtstatsApi} from "extstats-api";
import {NewReleasesComponent} from "./new-releases/new-releases.component";
import {MonthlySkylineComponent} from "./monthly-skyline/monthly-skyline.component";
import {PlaysByMonthYtdComponent} from "./plays-by-month-ytd/plays-by-month-ytd.component";
import {PlaysByMonthEverComponent} from "./plays-by-month-ever/plays-by-month-ever.component";
import {PlaysByYearComponent} from "./plays-by-year/plays-by-year.component";

export interface PlayData {
  year: number;
  month: number;
  expansion: boolean;
  quantity: number;
  bggid: number;
}
export interface CountData {
  year: number;
  month: number;
  count: number;
}
export interface GameData {
  bggid: number;
  name: string;
  yearPublished: number;
  playTime: number;
  isExpansion: boolean;
}
export interface GeekGameData {
  owned: boolean;
  game: GameData;
}
export interface MonthlyData {
  plays: PlayData[];
  counts: CountData[];
  geekGames: GeekGameData[];
}
export interface Result {
  monthly: MonthlyData;
}

@Component({
  selector: 'monthly-plays',
  imports: [
    LoaderComponent,
    NewReleasesComponent,
    MonthlySkylineComponent,
    PlaysByMonthYtdComponent,
    PlaysByMonthEverComponent,
    PlaysByYearComponent,
    SelectorComboComponent
  ],
  templateUrl: './app.component.html'
})
export class MonthlyWidget extends GraphQuerySourceComponent<Result> {
  private static DEFAULT_SELECTOR = "any(played(ME),owned(ME))";
  playsAndGame$: Observable<PlayAndGamesIndex>;
  selector = MonthlyWidget.DEFAULT_SELECTOR;
  @ViewChild(SelectorComboComponent) selectorCombo: SelectorComboComponent | undefined;


  constructor(api: ExtstatsApi, private userService: UserConfigService) {
    super(api);
    this.playsAndGame$ = this.data$.pipe(map((r: any) => indexPlays(this.inflate(r.monthly2))), share());
  }

  onSelectorChosen(event: string) {
    this.selector = event;
    super.refresh();
  }

  override ngAfterViewInit() {
    super.ngAfterViewInit();
    if (this.selectorCombo) {
      this.selectorCombo.setDefault(MonthlyWidget.DEFAULT_SELECTOR);
      this.selectorCombo.setSelected(MonthlyWidget.DEFAULT_SELECTOR);
    }
  }

  inflatePlays(plays: any[]): PlayData[] {
    return plays.map((p: any) => {
      return {
        bggid: p.bggid,
        expansion: p.e,
        month: p.ym % 100,
        year: Math.floor(p.ym / 100),
        quantity: p.q
      };
    })
  }

  inflateCounts(counts: any[]): CountData[] {
    return counts.map((c: any) => {
      return {
        count: c.c,
        month: c.ym % 100,
        year: Math.floor(c.ym / 100)
      };
    })
  }

  inflateGeekGames(ggs: any[]): GeekGameData[] {
    return ggs.map((gg: any) => {
      return {
        owned: gg.o,
        game: {
          bggid: gg.game.bggid,
          name: gg.game.name,
          isExpansion: gg.game.e,
          playTime: gg.game.pt,
          yearPublished: gg.game.yearPublished
        }
      };
    })
  }

  // turn the squished JSON into what the code expects
  inflate(monthly: any): MonthlyData {
    return {
      plays: this.inflatePlays(monthly.plays),
      counts: this.inflateCounts(monthly.counts),
      geekGames: this.inflateGeekGames(monthly.geekGames),
    }
  }

  protected buildQuery(): string {
    return `{monthly2(selector: "${this.selector}", vars: [{name: "ME", value: "${this.userService.getAGeek()}"}]) {` +
      " plays { ym e q bggid } " +
      " counts { ym c } " +
      " geekGames { o game { bggid n yp pt e } }" +
      "}}";
  }
}
