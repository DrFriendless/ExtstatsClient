import { bootstrapApplication } from '@angular/platform-browser';
import { PlaysWidget } from './app/app.component';
import {appConfig} from "./app/app.config";

bootstrapApplication(PlaysWidget, appConfig)
  .catch((err) => console.error(err));
