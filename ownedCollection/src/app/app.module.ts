import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ExtstatsAngularModule } from "extstats-angular";
import { FormsModule } from '@angular/forms';
import { UserOwnedComponent } from './app.component';
import { OwnedByPublishedYearComponent } from './owned-by-published-year/owned-by-published-year.component';
import { RatingsOfOwnedGamesComponent } from './ratings-of-owned-games/ratings-of-owned-games.component';
import { BggRatingsOfOwnedGamesComponent } from './bgg-ratings-of-owned-games/bgg-ratings-of-owned-games.component';
import { PlaysOfGamesOwnedComponent } from './plays-of-games-owned/plays-of-games-owned.component';
import { PogoTableComponent } from './pogo-table/pogo-table.component';
import { DataTableModule } from "extstats-datatable"

@NgModule({
  declarations: [
    UserOwnedComponent,
    OwnedByPublishedYearComponent,
    RatingsOfOwnedGamesComponent,
    BggRatingsOfOwnedGamesComponent,
    PlaysOfGamesOwnedComponent,
    PogoTableComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, TooltipModule.forRoot(), NgbModule.forRoot(), ExtstatsAngularModule, FormsModule,
    DataTableModule
  ],
  providers: [],
  bootstrap: [UserOwnedComponent]
})
export class AppModule { }
