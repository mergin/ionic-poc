import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAppInitializer, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

import { AppComponent } from '@app/app.component';
import { authInterceptor } from '@app/core/auth-interceptor/auth.interceptor';
import { apiErrorInterceptor } from '@app/core/error-interceptor/api-error.interceptor';
import { routes } from '@app/app.routes';
import { environment } from './environments/environment';

/**
 * Bootstraps the Ionic Angular application and starts MSW in non-production environments.
 * @returns Resolves when Angular application bootstrap is complete.
 */
async function bootstrap(): Promise<void> {
  if (!environment.production) {
    const { startMockWorker } = await import('@mocks/browser');
    await startMockWorker();
  }

  await bootstrapApplication(AppComponent, {
    providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideIonicAngular(),
      provideHttpClient(withInterceptors([authInterceptor, apiErrorInterceptor])),
      provideTranslateService({
        lang: 'en',
        fallbackLang: 'en',
        loader: provideTranslateHttpLoader({
          prefix: '/assets/i18n/',
          suffix: '.json',
        }),
      }),
      provideAppInitializer(() => {
        const translateService = inject(TranslateService);
        translateService.setFallbackLang('en');
        return firstValueFrom(translateService.use('en'));
      }),
      provideRouter(routes, withPreloading(PreloadAllModules)),
    ],
  });
}

void bootstrap();
