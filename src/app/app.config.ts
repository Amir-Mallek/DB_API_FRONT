import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import { routes } from './app.routes';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {tokenProviderInterceptor} from "./interceptors/token-provider.interceptor";
import {unauthorizedRequestInterceptor} from "./interceptors/unauthorized-request.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(
      withInterceptors([tokenProviderInterceptor, unauthorizedRequestInterceptor])
    )
  ]
};
