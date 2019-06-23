import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http"
import { ExtstatsAngularModule } from "extstats-angular"

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, HttpClientModule, ExtstatsAngularModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
