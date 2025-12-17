import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { YearlyComponent} from './app/app.component';

bootstrapApplication(YearlyComponent, appConfig)
  .catch((err) => console.error(err));
