import {
  HttpClient,
  HttpContext,
  HttpErrorResponse,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { TestBed, fakeAsync, flushMicrotasks, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ToastController } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';

import { environment } from '@env/environment';
import { apiErrorInterceptor, IGNORE_API_ERROR_HANDLING } from './api-error.interceptor';

const RETRY_FIRST_DELAY_MS = 500;
const RETRY_SECOND_DELAY_MS = 1000;
const IGNORE_RETRY_WAIT_MS = 2000;

describe('apiErrorInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let toastControllerSpy: jasmine.SpyObj<ToastController>;
  let translateServiceSpy: jasmine.SpyObj<TranslateService>;
  let toastElementSpy: Pick<HTMLIonToastElement, 'present'>;
  let consoleErrorSpy: jasmine.Spy;
  let originalProductionValue: boolean;

  beforeEach(() => {
    // ARRANGE
    originalProductionValue = environment.production;
    (environment as { production: boolean }).production = false;

    toastElementSpy = {
      present: jasmine.createSpy('present').and.resolveTo(),
    };

    toastControllerSpy = jasmine.createSpyObj<ToastController>('ToastController', ['create']);
    toastControllerSpy.create.and.resolveTo(
      toastElementSpy as unknown as Awaited<ReturnType<ToastController['create']>>,
    );

    translateServiceSpy = jasmine.createSpyObj<TranslateService>('TranslateService', ['instant']);
    translateServiceSpy.instant.and.callFake((key: string) => `translated:${key}`);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
        { provide: ToastController, useValue: toastControllerSpy },
        { provide: TranslateService, useValue: translateServiceSpy },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    consoleErrorSpy = spyOn(console, 'error');
  });

  afterEach(() => {
    // ARRANGE
    (environment as { production: boolean }).production = originalProductionValue;

    // ASSERT
    httpTestingController.verify();
  });

  it('shows an error toast and logs details in development mode', fakeAsync(() => {
    // ARRANGE
    let receivedError: HttpErrorResponse | null = null;

    // ACT
    httpClient.get('/api/dev-error').subscribe({
      next: () => fail('Expected request to fail.'),
      error: (error: HttpErrorResponse) => {
        receivedError = error;
      },
    });

    const requestAttempt1 = httpTestingController.expectOne('/api/dev-error');
    requestAttempt1.flush({ message: 'failure' }, { status: 500, statusText: 'Server Error' });

    tick(RETRY_FIRST_DELAY_MS);

    const requestAttempt2 = httpTestingController.expectOne('/api/dev-error');
    requestAttempt2.flush({ message: 'failure' }, { status: 500, statusText: 'Server Error' });

    tick(RETRY_SECOND_DELAY_MS);

    const requestAttempt3 = httpTestingController.expectOne('/api/dev-error');
    requestAttempt3.flush({ message: 'failure' }, { status: 500, statusText: 'Server Error' });
    flushMicrotasks();

    // ASSERT
    expect(receivedError).toBeTruthy();
    expect(toastControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(toastControllerSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        message: 'translated:errors.server',
        position: 'top',
        color: 'danger',
      }),
    );
    expect(toastElementSpy.present).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).toHaveBeenCalledTimes(1);
    expect(translateServiceSpy.instant).toHaveBeenCalledWith('errors.server');
  }));

  it('retries with exponential backoff and succeeds without showing a toast', fakeAsync(() => {
    // ARRANGE
    let responseBody: { done: boolean } | undefined;

    // ACT
    httpClient.get<{ done: boolean }>('/api/retry-success').subscribe({
      next: (response: { done: boolean }) => {
        responseBody = response;
      },
      error: () => fail('Expected request to eventually succeed.'),
    });

    const requestAttempt1 = httpTestingController.expectOne('/api/retry-success');
    requestAttempt1.flush(
      { message: 'temporary failure' },
      { status: 503, statusText: 'Service Unavailable' },
    );

    tick(RETRY_FIRST_DELAY_MS);

    const requestAttempt2 = httpTestingController.expectOne('/api/retry-success');
    requestAttempt2.flush({ done: true });
    flushMicrotasks();

    // ASSERT
    expect(responseBody).toEqual({ done: true });
    expect(toastControllerSpy.create).not.toHaveBeenCalled();
    expect(toastElementSpy.present).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  }));

  it('skips toast and logging when ignore context token is enabled', fakeAsync(() => {
    // ARRANGE
    let receivedError: HttpErrorResponse | null = null;
    const context = new HttpContext().set(IGNORE_API_ERROR_HANDLING, true);

    // ACT
    httpClient.get('/api/ignored-error', { context }).subscribe({
      next: () => fail('Expected request to fail.'),
      error: (error: HttpErrorResponse) => {
        receivedError = error;
      },
    });

    const request = httpTestingController.expectOne('/api/ignored-error');
    request.flush({ message: 'failure' }, { status: 500, statusText: 'Server Error' });
    tick(IGNORE_RETRY_WAIT_MS);
    httpTestingController.expectNone('/api/ignored-error');
    flushMicrotasks();

    // ASSERT
    expect(receivedError).toBeTruthy();
    expect(toastControllerSpy.create).not.toHaveBeenCalled();
    expect(toastElementSpy.present).not.toHaveBeenCalled();
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  }));

  it('does not log to console in production mode', fakeAsync(() => {
    // ARRANGE
    (environment as { production: boolean }).production = true;
    let receivedError: HttpErrorResponse | null = null;

    // ACT
    httpClient.get('/api/prod-error').subscribe({
      next: () => fail('Expected request to fail.'),
      error: (error: HttpErrorResponse) => {
        receivedError = error;
      },
    });

    const requestAttempt1 = httpTestingController.expectOne('/api/prod-error');
    requestAttempt1.flush({ message: 'offline' }, { status: 0, statusText: 'Unknown Error' });

    tick(RETRY_FIRST_DELAY_MS);

    const requestAttempt2 = httpTestingController.expectOne('/api/prod-error');
    requestAttempt2.flush({ message: 'offline' }, { status: 0, statusText: 'Unknown Error' });

    tick(RETRY_SECOND_DELAY_MS);

    const requestAttempt3 = httpTestingController.expectOne('/api/prod-error');
    requestAttempt3.flush({ message: 'offline' }, { status: 0, statusText: 'Unknown Error' });
    flushMicrotasks();

    // ASSERT
    expect(receivedError).toBeTruthy();
    expect(toastControllerSpy.create).toHaveBeenCalledTimes(1);
    expect(toastControllerSpy.create).toHaveBeenCalledWith(
      jasmine.objectContaining({
        message: 'translated:errors.network',
      }),
    );
    expect(toastElementSpy.present).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  }));
});
