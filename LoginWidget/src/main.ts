import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { LoginComponent} from './app/app.component';

bootstrapApplication(LoginComponent, appConfig)
  .catch((err) => console.error(err));
