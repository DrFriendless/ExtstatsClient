import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import {provideHttpClient} from "@angular/common/http";
import {ExtstatsApi} from "extstats-api";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    { provide: ExtstatsApi, useFactory: () => new ExtstatsApi((window as any).EXTSTATS_ENV.api_url) }
  ]
};
