import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PlaysWidget } from './app.component';
import { NewPlaysComponent } from './new-plays/new-plays.component';
import { HttpClientModule } from "@angular/common/http";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ExtstatsAngularModule } from "extstats-angular";
import { FormsModule } from '@angular/forms';
import { DataTableModule } from "extstats-datatable";
import { TemporalByDateComponent } from './temporal-by-date/temporal-by-date.component';
import { TemporalByMonthComponent } from './temporal-by-month/temporal-by-month.component';
import { TemporalByDayComponent } from './temporal-by-day/temporal-by-day.component';
import { MostPlayedByYearComponent } from './most-played-by-year/most-played-by-year.component';

@NgModule({
  declarations: [
    PlaysWidget,
    NewPlaysComponent,
    TemporalByDateComponent,
    TemporalByMonthComponent,
    TemporalByDayComponent,
    MostPlayedByYearComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, TooltipModule.forRoot(), ExtstatsAngularModule, FormsModule, DataTableModule
  ],
  providers: [],
  bootstrap: [PlaysWidget]
})
export class AppModule { }
