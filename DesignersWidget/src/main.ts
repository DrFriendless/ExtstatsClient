import { bootstrapApplication } from '@angular/platform-browser';
import { DesignersWidget } from './app/app.component';
import {appConfig} from "./app/app.config";

bootstrapApplication(DesignersWidget, appConfig)
  .catch((err) => console.error(err));
