import { bootstrapApplication } from '@angular/platform-browser';
import {appConfig} from "./app/app.config";
import {TagalogueWidget} from "./app/app.component";

bootstrapApplication(TagalogueWidget, appConfig)
  .catch((err) => console.error(err));
