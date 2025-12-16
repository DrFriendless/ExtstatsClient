import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import {UserConfigComponent} from "./app/app.component";

bootstrapApplication(UserConfigComponent, appConfig)
  .catch((err) => console.error(err));
