import { bootstrapApplication } from '@angular/platform-browser';
import { GeekWidget } from './app/app.component';
import {appConfig} from "./app/app.config";

bootstrapApplication(GeekWidget, appConfig)
  .catch((err) => console.error(err));
