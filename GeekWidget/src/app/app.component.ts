import { Component, AfterViewInit } from '@angular/core';
import { GeekSummary } from 'extstats-core';
import {GeekComboComponent, LoaderComponent, UserDataService} from 'extstats-angular';
import {ExtstatsApi} from "extstats-api";
import {CollectionPanelComponent} from "./collection-panel/collection-panel.component";
import {OwnedPanelComponent} from "./owned-panel/owned-panel.component";
import {FavouritesPanelComponent} from "./favourites-panel/favourites-panel.component";
import {PlaysPanelComponent} from "./plays-panel/plays-panel.component";
import {MonthlyPanelComponent} from "./monthly-panel/monthly-panel.component";
import {YearlyPanelComponent} from "./yearly-panel/yearly-panel.component";
import {MultiplaysPanelComponent} from "./multiplays-panel/multiplays-panel.component";
import {UpdatesPanelComponent} from "./updates-panel/updates-panel.component";
import {NewsComponent} from "./news/news.component";

@Component({
  selector: 'extstats-geek',
  imports: [
    CollectionPanelComponent,
    OwnedPanelComponent,
    FavouritesPanelComponent,
    PlaysPanelComponent,
    MonthlyPanelComponent,
    YearlyPanelComponent,
    MultiplaysPanelComponent,
    UpdatesPanelComponent,
    LoaderComponent,
    GeekComboComponent,
    NewsComponent
  ],
  templateUrl: './app.component.html'
})
export class GeekWidget implements AfterViewInit {
  public data: GeekSummary | undefined;
  public geek: string | undefined;
  public foundGeek: string | undefined;
  public loading = true;

  public constructor(private api: ExtstatsApi, private userDataService: UserDataService) {
  }

  async ngAfterViewInit() {
    this.geek = this.userDataService.getAGeek();
    if (this.geek) {
      this.loading = true;
      this.data = await this.api.getGeekSummary(this.geek);
      this.loading = false;
    }
  }

  public choose(geek: string) {
    this.foundGeek = geek;
  }
}
