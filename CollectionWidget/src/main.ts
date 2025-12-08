import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { UserCollectionComponent} from './app/app.component';

bootstrapApplication(UserCollectionComponent, appConfig)
  .catch((err) => console.error(err));
