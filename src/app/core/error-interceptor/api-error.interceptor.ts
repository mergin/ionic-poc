import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastController } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { catchError, retry, throwError, timer } from 'rxjs';

import { environment } from '@env/environment';

/**
 * Defines whether API error handling should be skipped for a request.
 */
export const IGNORE_API_ERROR_HANDLING = new HttpContextToken<boolean>(() => false);

/**
 * Defines the fallback maximum number of retry attempts for transient API failures.
 */
const DEFAULT_MAX_RETRY_ATTEMPTS = 2;

/**
 * Defines the fallback base delay in milliseconds used for retry backoff.
 */
const DEFAULT_RETRY_BASE_DELAY_MS = 500;

/**
 * Defines the fallback duration in milliseconds for API error toasts.
 */
const DEFAULT_ERROR_TOAST_DURATION_MS = 4500;

/**
 * Defines the minimum HTTP status code that is considered a server error.
 */
const SERVER_ERROR_STATUS_MIN = 500;

/**
 * Defines the exponential base for retry backoff.
 */
const EXPONENTIAL_BACKOFF_BASE = 2;

/**
 * Intercepts failed HTTP calls and displays a user-friendly toast notification.
 * @param req The outgoing HTTP request.
 * @param next The next handler in the interceptor chain.
 * @returns An observable that emits the HTTP response stream or rethrows errors.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastController = inject(ToastController);
  const translateService = inject(TranslateService);
  const ignoreErrorHandling = req.context.get(IGNORE_API_ERROR_HANDLING);
  const maxRetryAttempts = resolveMaxRetryAttempts();
  const retryBaseDelayMs = resolveRetryBaseDelayMs();
  const errorToastDurationMs = resolveErrorToastDurationMs();

  const request$ = ignoreErrorHandling
    ? next(req)
    : next(req).pipe(
        retry({
          count: maxRetryAttempts,
          delay: (error: unknown, retryCount: number) => {
            if (!shouldRetryRequest(error)) {
              return throwError(() => error);
            }

            return timer(resolveRetryDelay(retryCount, retryBaseDelayMs));
          },
        }),
      );

  return request$.pipe(
    catchError((error: unknown) => {
      if (ignoreErrorHandling) {
        return throwError(() => error);
      }

      logErrorInDevelopment(error, req.url);
      void presentErrorToast(error, toastController, translateService, errorToastDurationMs);

      return throwError(() => error);
    }),
  );
};

/**
 * Logs error details only in development mode.
 * @param error The error caught by the interceptor.
 * @param url The URL associated with the failed request.
 * @returns void
 */
function logErrorInDevelopment(error: unknown, url: string): void {
  if (environment.production) {
    return;
  }

  console.error('[API Error Interceptor]', {
    url,
    error,
  });
}

/**
 * Determines whether a failed request should be retried.
 * @param error The error emitted by the HTTP request.
 * @returns True when the error is transient and retryable.
 */
function shouldRetryRequest(error: unknown): boolean {
  if (!(error instanceof HttpErrorResponse)) {
    return false;
  }

  return error.status === 0 || error.status >= SERVER_ERROR_STATUS_MIN;
}

/**
 * Resolves the configured max retry attempts from environment with fallback.
 * @returns The maximum number of retry attempts.
 */
function resolveMaxRetryAttempts(): number {
  const configuredMaxRetryAttempts = environment.apiErrorRetry?.maxAttempts;

  if (
    typeof configuredMaxRetryAttempts !== 'number' ||
    !Number.isInteger(configuredMaxRetryAttempts) ||
    configuredMaxRetryAttempts < 0
  ) {
    return DEFAULT_MAX_RETRY_ATTEMPTS;
  }

  return configuredMaxRetryAttempts;
}

/**
 * Resolves the configured retry base delay from environment with fallback.
 * @returns The base delay in milliseconds used for retry backoff.
 */
function resolveRetryBaseDelayMs(): number {
  const configuredBaseDelayMs = environment.apiErrorRetry?.baseDelayMs;

  if (
    typeof configuredBaseDelayMs !== 'number' ||
    !Number.isFinite(configuredBaseDelayMs) ||
    configuredBaseDelayMs < 0
  ) {
    return DEFAULT_RETRY_BASE_DELAY_MS;
  }

  return configuredBaseDelayMs;
}

/**
 * Resolves the configured error toast duration from environment with fallback.
 * @returns The toast duration in milliseconds.
 */
function resolveErrorToastDurationMs(): number {
  const configuredToastDurationMs = environment.apiErrorToast?.durationMs;

  if (
    typeof configuredToastDurationMs !== 'number' ||
    !Number.isFinite(configuredToastDurationMs) ||
    configuredToastDurationMs < 0
  ) {
    return DEFAULT_ERROR_TOAST_DURATION_MS;
  }

  return configuredToastDurationMs;
}

/**
 * Resolves exponential backoff delay based on retry attempt number.
 * @param retryCount The current retry attempt (1-based).
 * @param retryBaseDelayMs The base delay in milliseconds.
 * @returns The backoff delay in milliseconds.
 */
function resolveRetryDelay(retryCount: number, retryBaseDelayMs: number): number {
  return retryBaseDelayMs * EXPONENTIAL_BACKOFF_BASE ** (retryCount - 1);
}

/**
 * Creates and presents a toast with a translated, user-friendly error message.
 * @param error The HTTP error to map into a message.
 * @param toastController The Ionic toast controller.
 * @param translateService The translation service.
 * @param durationMs
 * @returns Resolves when toast presentation has been attempted.
 */
async function presentErrorToast(
  error: unknown,
  toastController: ToastController,
  translateService: TranslateService,
  durationMs: number,
): Promise<void> {
  const messageKey = resolveErrorMessageKey(error);
  const toast = await toastController.create({
    message: translateService.instant(messageKey),
    duration: durationMs,
    position: 'top',
    color: 'danger',
    buttons: [
      {
        text: translateService.instant('common.dismiss'),
        role: 'cancel',
      },
    ],
    htmlAttributes: {
      role: 'alert',
      'aria-live': 'assertive',
    },
  });

  await toast.present();
}

/**
 * Resolves the translation key for the provided HTTP error.
 * @param error The error caught by the interceptor.
 * @returns A translation key for the toast message.
 */
function resolveErrorMessageKey(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return 'errors.generic';
  }

  if (error.status === 0) {
    return 'errors.network';
  }

  if (error.status >= SERVER_ERROR_STATUS_MIN) {
    return 'errors.server';
  }

  return 'errors.generic';
}
