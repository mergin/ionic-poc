import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import {
  RouteReuseStrategy,
  provideRouter,
  withPreloading,
  PreloadAllModules,
} from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideTranslateService } from '@ngx-translate/core';

import { AppComponent } from '@app/app.component';
import { routes } from '@app/app.routes';
import { environment } from './environments/environment';

async function bootstrap(): Promise<void> {
  if (!environment.production) {
    const { startMockWorker } = await import('@mocks/browser');
    await startMockWorker();
  }

  await bootstrapApplication(AppComponent, {
    providers: [
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
      provideIonicAngular(),
      provideHttpClient(),
      provideTranslateService({
        lang: 'en',
        fallbackLang: 'en',
        loader: provideTranslateHttpLoader({
          prefix: '/assets/i18n/',
          suffix: '.json',
        }),
      }),
      provideRouter(routes, withPreloading(PreloadAllModules)),
    ],
  });
}

void bootstrap();
