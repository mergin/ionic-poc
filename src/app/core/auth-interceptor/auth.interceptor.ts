import { DOCUMENT } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { environment } from '@env/environment';

/**
 * Fallback storage key used to retrieve auth token from sessionStorage.
 */
const DEFAULT_SESSION_STORAGE_TOKEN_KEY = 'access_token';

/**
 * Fallback cookie key used to retrieve auth token from document cookies.
 */
const DEFAULT_COOKIE_TOKEN_KEY = 'access_token';

/**
 * Fallback fake token used only in development when no real token is found.
 */
const DEFAULT_DEVELOPMENT_FAKE_TOKEN = 'dev-fake-access-token';

/**
 * Intercepts requests and injects an Authorization bearer token when available.
 * @param req The outgoing HTTP request.
 * @param next The next handler in the interceptor chain.
 * @returns An observable with the HTTP response stream.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.headers.has('Authorization')) {
    return next(req);
  }

  const token = resolveAuthToken();

  if (!token) {
    return next(req);
  }

  const requestWithAuth = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(requestWithAuth);
};

/**
 * Resolves the token from sessionStorage or cookie, with dev fallback token in non-production.
 * @returns The resolved token string, or null when unavailable.
 */
function resolveAuthToken(): string | null {
  const documentRef = inject(DOCUMENT);
  const sessionStorageKey =
    environment.auth?.sessionStorageTokenKey ?? DEFAULT_SESSION_STORAGE_TOKEN_KEY;
  const cookieTokenKey = environment.auth?.cookieTokenKey ?? DEFAULT_COOKIE_TOKEN_KEY;
  const developmentToken = environment.auth?.developmentFakeToken ?? DEFAULT_DEVELOPMENT_FAKE_TOKEN;

  const sessionStorageToken = sessionStorage.getItem(sessionStorageKey);
  if (sessionStorageToken) {
    return sessionStorageToken;
  }

  const cookieToken = readCookieToken(documentRef.cookie, cookieTokenKey);
  if (cookieToken) {
    return cookieToken;
  }

  if (!environment.production) {
    return developmentToken;
  }

  return null;
}

/**
 * Reads a token value from a cookie string by key.
 * @param cookieHeader The full cookie header string.
 * @param key The cookie name to lookup.
 * @returns The cookie value when found, otherwise null.
 */
function readCookieToken(cookieHeader: string, key: string): string | null {
  const cookies = cookieHeader.split(';');

  for (const cookieEntry of cookies) {
    const trimmedCookieEntry = cookieEntry.trim();
    if (trimmedCookieEntry.startsWith(`${key}=`)) {
      return trimmedCookieEntry.slice(key.length + 1);
    }
  }

  return null;
}
