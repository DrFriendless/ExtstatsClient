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
import {inflate, Result} from "./inflate";



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
    this.playsAndGame$ = this.data$.pipe(map((r: Result) => indexPlays(inflate(r.monthly2))), share());
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

  protected buildQuery(): string {
    return `{monthly2(selector: "${this.selector}", vars: [{name: "ME", value: "${this.userService.getAGeek()}"}]) {` +
      " plays { ym e q bggid } " +
      " counts { ym c } " +
      " geekGames { o game { bggid n yp pt e } }" +
      "}}";
  }
}
