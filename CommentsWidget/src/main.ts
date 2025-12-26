import { bootstrapApplication } from '@angular/platform-browser';
import { CommentsWidget } from './app/app.component';
import {appConfig} from "./app/app.config";

bootstrapApplication(CommentsWidget, appConfig)
  .catch((err) => console.error(err));
