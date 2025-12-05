import { bootstrapApplication } from '@angular/platform-browser';
import {UserOwnedComponent} from './app/app.component';
import {appConfig} from "./app/app.config";

bootstrapApplication(UserOwnedComponent, appConfig)
  .catch((err) => console.error(err));
