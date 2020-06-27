import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { WarTableComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { ExtstatsAngularModule } from "extstats-angular"
import {ExtstatsDatatableModule} from "extstats-datatable";

@NgModule({
  declarations: [
    WarTableComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, ExtstatsDatatableModule, ExtstatsAngularModule
  ],
  providers: [],
  bootstrap: [WarTableComponent]
})
export class AppModule { }
