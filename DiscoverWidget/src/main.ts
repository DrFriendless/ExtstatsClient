import { bootstrapApplication } from '@angular/platform-browser';
import { DiscoverWidget } from './app/app.component';
import {appConfig} from "./app/app.config";

bootstrapApplication(DiscoverWidget, appConfig)
  .catch((err) => console.error(err));
