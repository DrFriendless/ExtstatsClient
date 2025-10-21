import { bootstrapApplication } from '@angular/platform-browser';
import { WarTableComponent } from './app/app.component';
import {appConfig} from "./app/app.config";

bootstrapApplication(WarTableComponent, appConfig)
  .catch((err) => console.error(err));
