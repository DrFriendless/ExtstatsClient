import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { MonthlyWidget } from './app.component';
import { PlaysByMonthEverComponent } from './plays-by-month-ever/plays-by-month-ever.component';
import { PlaysByMonthYtdComponent } from './plays-by-month-ytd/plays-by-month-ytd.component';
import { DataTableModule } from "extstats-datatable";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ExtstatsAngularModule } from "extstats-angular";
import { PlaysByYearComponent } from './plays-by-year/plays-by-year.component';

@NgModule({
  declarations: [
    MonthlyWidget,
    PlaysByMonthEverComponent,
    PlaysByMonthYtdComponent,
    PlaysByYearComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, DataTableModule, TooltipModule.forRoot(), NgbModule.forRoot(), ExtstatsAngularModule
  ],
  providers: [],
  bootstrap: [MonthlyWidget]
})
export class AppModule { }
