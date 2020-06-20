import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FavouritesComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { ExtstatsDatatableModule} from "extstats-datatable";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ExtstatsAngularModule } from "extstats-angular";
import { FormsModule } from '@angular/forms';
import { FavouritesTableComponent } from './favourites-table/favourites-table.component';
import { AverageVsRatingComponent } from './average-vs-rating/average-vs-rating.component';
import { RatingVsPlaysComponent } from './rating-vs-plays/rating-vs-plays.component';
import { RatingVsMonthsPlayedComponent } from './rating-vs-months-played/rating-vs-months-played.component';
import { YouShouldPlayComponent } from './you-should-play/you-should-play.component';
import {Ng5SliderModule} from "ng5-slider";
import { ComplexityVsRatingComponent } from './complexity-vs-rating/complexity-vs-rating.component';
import { ComplexityVsPlaysComponent } from './complexity-vs-plays/complexity-vs-plays.component';

@NgModule({
  declarations: [
    FavouritesComponent,
    FavouritesTableComponent,
    AverageVsRatingComponent,
    RatingVsPlaysComponent,
    RatingVsMonthsPlayedComponent,
    YouShouldPlayComponent,
    ComplexityVsRatingComponent,
    ComplexityVsPlaysComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, ExtstatsDatatableModule, TooltipModule.forRoot(), NgbModule, ExtstatsAngularModule,
    FormsModule, Ng5SliderModule
  ],
  providers: [],
  bootstrap: [FavouritesComponent]
})
export class AppModule { }
