import { bootstrapApplication } from '@angular/platform-browser';
import {appConfig} from "./app/app.config";
import {CatalistWidget} from "./app/app.component";

bootstrapApplication(CatalistWidget, appConfig)
  .catch((err) => console.error(err));
