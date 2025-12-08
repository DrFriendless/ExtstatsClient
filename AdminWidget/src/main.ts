import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { ExtStatsAdminComponent } from './app/app.component';

bootstrapApplication(ExtStatsAdminComponent, appConfig)
  .catch((err) => console.error(err));
