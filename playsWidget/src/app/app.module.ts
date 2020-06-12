import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PlaysWidget } from './app.component';
import { NewPlaysComponent } from './new-plays/new-plays.component';
import { HttpClientModule } from "@angular/common/http";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ExtstatsAngularModule } from "extstats-angular";
import { FormsModule } from '@angular/forms';
import { TemporalByDateComponent } from './temporal-by-date/temporal-by-date.component';
import { TemporalByMonthComponent } from './temporal-by-month/temporal-by-month.component';
import { TemporalByDayComponent } from './temporal-by-day/temporal-by-day.component';
import { MostPlayedByYearComponent } from './most-played-by-year/most-played-by-year.component';
import { FlorenceNightingaleComponent } from './florence-nightingale/florence-nightingale.component';
import { BestDaysComponent } from './best-days/best-days.component';
import {ExtstatsDatatableModule} from "extstats-datatable";
import {CommonModule} from "@angular/common";
import {Ng5SliderModule} from "ng5-slider";

@NgModule({
  declarations: [
    PlaysWidget,
    NewPlaysComponent,
    TemporalByDateComponent,
    TemporalByMonthComponent,
    TemporalByDayComponent,
    MostPlayedByYearComponent,
    FlorenceNightingaleComponent,
    BestDaysComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, TooltipModule.forRoot(), ExtstatsAngularModule, FormsModule,
    ExtstatsDatatableModule, CommonModule, Ng5SliderModule
  ],
  providers: [],
  bootstrap: [PlaysWidget]
})
export class AppModule { }
