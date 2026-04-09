import { bootstrapApplication } from '@angular/platform-browser';
import { QueryWidget } from './app/app.component';
import {appConfig} from "./app/app.config";

bootstrapApplication(QueryWidget, appConfig)
  .catch((err) => console.error(err));
