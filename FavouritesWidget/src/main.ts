import { bootstrapApplication } from '@angular/platform-browser';
import {FavouritesComponent} from './app/app.component';
import {appConfig} from "./app/app.config";

bootstrapApplication(FavouritesComponent, appConfig)
  .catch((err) => console.error(err));
