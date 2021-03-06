import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { YearlyComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { MikeHulsebusComponent } from './mike-hulsebus/mike-hulsebus.component';
import {ExtstatsAngularModule} from "extstats-angular";
import { YearChooserComponent } from './year-chooser/year-chooser.component';
import { NickelAndDimeComponent } from './nickel-and-dime/nickel-and-dime.component';
import { NickelDimeTableComponent } from './nickel-dime-table/nickel-dime-table.component';
import { YearlyBestDaysComponent } from './yearly-best-days/yearly-best-days.component';

@NgModule({
  declarations: [
    YearlyComponent,
    MikeHulsebusComponent,
    YearChooserComponent,
    NickelAndDimeComponent,
    NickelDimeTableComponent,
    YearlyBestDaysComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, ExtstatsAngularModule
  ],
  providers: [],
  bootstrap: [YearlyComponent]
})
export class AppModule { }
