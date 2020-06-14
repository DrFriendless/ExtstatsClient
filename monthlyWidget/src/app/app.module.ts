import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MonthlyWidget } from './app.component';
import { PlaysByMonthEverComponent } from './plays-by-month-ever/plays-by-month-ever.component';
import { PlaysByMonthYtdComponent } from './plays-by-month-ytd/plays-by-month-ytd.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PlaysByYearComponent } from './plays-by-year/plays-by-year.component';
import {HttpClientModule} from "@angular/common/http";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ExtstatsAngularModule} from "extstats-angular";
import {ExtstatsDatatableModule} from "extstats-datatable";
import { MonthlySkylineComponent } from './monthly-skyline/monthly-skyline.component';

@NgModule({
  declarations: [
    MonthlyWidget,
    PlaysByMonthEverComponent,
    PlaysByMonthYtdComponent,
    PlaysByYearComponent,
    MonthlySkylineComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, ExtstatsDatatableModule, TooltipModule.forRoot(), NgbModule, ExtstatsAngularModule
  ],
  providers: [],
  bootstrap: [MonthlyWidget]
})
export class AppModule { }
