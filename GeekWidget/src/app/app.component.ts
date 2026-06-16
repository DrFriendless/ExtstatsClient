import { Component, AfterViewInit } from '@angular/core';
import {GeekComboComponent, LoaderComponent, UserConfigService} from 'extstats-angular';
import {ExtstatsApi, GeekSummary} from "extstats-api";
import {CollectionPanelComponent} from "./collection-panel/collection-panel.component";
import {OwnedPanelComponent} from "./owned-panel/owned-panel.component";
import {FavouritesPanelComponent} from "./favourites-panel/favourites-panel.component";
import {PlaysPanelComponent} from "./plays-panel/plays-panel.component";
import {MonthlyPanelComponent} from "./monthly-panel/monthly-panel.component";
import {YearlyPanelComponent} from "./yearly-panel/yearly-panel.component";
import {MultiplaysPanelComponent} from "./multiplays-panel/multiplays-panel.component";
import {NewsComponent} from "./news/news.component";
import {DiscoverPanelComponent} from "./discover-panel/discover-panel.component";
import {GeeklistUtilComponent} from "./geeklist-util/geeklist-util.component";
import {DesignersPanelComponent} from "./designers-panel/designers-panel.component";

@Component({
  selector: 'extstats-geek',
  imports: [
    CollectionPanelComponent,
    OwnedPanelComponent,
    FavouritesPanelComponent,
    PlaysPanelComponent,
    MonthlyPanelComponent,
    YearlyPanelComponent,
    DiscoverPanelComponent,
    MultiplaysPanelComponent,
    LoaderComponent,
    GeekComboComponent,
    NewsComponent,
    GeeklistUtilComponent,
    DesignersPanelComponent
  ],
  templateUrl: './app.component.html'
})
export class GeekWidget implements AfterViewInit {
  public data: GeekSummary | undefined;
  public geek: string | undefined;
  public foundGeek: string | undefined;
  public loading = true;
  public loggedIn = false;

  public constructor(private api: ExtstatsApi, private userService: UserConfigService) {
  }

  async ngAfterViewInit() {
    this.geek = this.userService.getAGeek();
    if (this.geek) {
      this.loading = true;
      this.data = await this.api.getGeekSummary(this.geek);
      this.loading = false;
    }
    this.loggedIn = !!this.userService.getLoggedInGeek();
  }

  public choose(geek: string) {
    this.foundGeek = geek;
  }
}
