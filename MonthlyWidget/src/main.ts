import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import {MonthlyWidget} from './app/app.component';

bootstrapApplication(MonthlyWidget, appConfig)
  .catch((err) => console.error(err));
