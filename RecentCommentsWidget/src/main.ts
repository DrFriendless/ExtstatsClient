import { bootstrapApplication } from '@angular/platform-browser';
import { RecentCommentsWidget } from './app/app.component';
import {appConfig} from "./app/app.config";

bootstrapApplication(RecentCommentsWidget, appConfig)
  .catch((err) => console.error(err));
