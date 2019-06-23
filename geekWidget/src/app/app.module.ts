import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { GeekWidget } from './app.component';
import { FavouritesPanelComponent } from './favourites-panel/favourites-panel.component';
import { PlaysPanelComponent } from './plays-panel/plays-panel.component';
import { YearlyPanelComponent } from './yearly-panel/yearly-panel.component';
import { CollectionPanelComponent } from './collection-panel/collection-panel.component';
import { OwnedPanelComponent } from './owned-panel/owned-panel.component';
import { NewsComponent } from './news/news.component';
import { MonthlyPanelComponent } from './monthly-panel/monthly-panel.component';
import { MultiplaysPanelComponent } from './multiplays-panel/multiplays-panel.component';
import { ExtstatsAngularModule } from 'extstats-angular';
import { UpdatesPanelComponent } from './updates-panel/updates-panel.component';

@NgModule({
  declarations: [
    GeekWidget,
    FavouritesPanelComponent,
    PlaysPanelComponent,
    YearlyPanelComponent,
    CollectionPanelComponent,
    OwnedPanelComponent,
    NewsComponent,
    MonthlyPanelComponent,
    MultiplaysPanelComponent,
    UpdatesPanelComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, ExtstatsAngularModule
  ],
  providers: [],
  bootstrap: [GeekWidget]
})
export class AppModule { }
