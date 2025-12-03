import { bootstrapApplication } from '@angular/platform-browser';
import {RankingTableComponent} from './app/app.component';
import {appConfig} from "./app/app.config";

bootstrapApplication(RankingTableComponent, appConfig)
  .catch((err) => console.error(err));
