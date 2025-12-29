import { bootstrapApplication } from '@angular/platform-browser';
import { MultiplaysWidget } from './app/app.component';
import {appConfig} from "./app/app.config";

bootstrapApplication(MultiplaysWidget, appConfig)
  .catch((err) => console.error(err));
