import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { environment } from '@env/environment';
import { authInterceptor } from './auth.interceptor';

describe('authInterceptor', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let originalProductionValue: boolean;
  let originalAuthConfig: typeof environment.auth;

  beforeEach(() => {
    // ARRANGE
    originalProductionValue = environment.production;
    originalAuthConfig = environment.auth;
    (environment as { production: boolean }).production = false;
    (environment as { auth?: typeof environment.auth }).auth = {
      sessionStorageTokenKey: 'access_token',
      cookieTokenKey: 'access_token',
      developmentFakeToken: 'dev-fake-access-token',
    };

    sessionStorage.clear();
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // CLEANUP
    sessionStorage.clear();
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    (environment as { production: boolean }).production = originalProductionValue;
    (environment as { auth?: typeof environment.auth }).auth = originalAuthConfig;

    // ASSERT
    httpTestingController.verify();
  });

  it('adds authorization header from sessionStorage token', () => {
    // ARRANGE
    sessionStorage.setItem('access_token', 'session-token');

    // ACT
    httpClient.get('/api/auth-from-session').subscribe();
    const request = httpTestingController.expectOne('/api/auth-from-session');

    // ASSERT
    expect(request.request.headers.get('Authorization')).toBe('Bearer session-token');
    request.flush({});
  });

  it('adds authorization header from cookie token when sessionStorage is empty', () => {
    // ARRANGE
    document.cookie = 'access_token=cookie-token; path=/';

    // ACT
    httpClient.get('/api/auth-from-cookie').subscribe();
    const request = httpTestingController.expectOne('/api/auth-from-cookie');

    // ASSERT
    expect(request.request.headers.get('Authorization')).toBe('Bearer cookie-token');
    request.flush({});
  });

  it('adds fake token in development when no token exists in storage or cookie', () => {
    // ARRANGE

    // ACT
    httpClient.get('/api/auth-from-dev-fallback').subscribe();
    const request = httpTestingController.expectOne('/api/auth-from-dev-fallback');

    // ASSERT
    expect(request.request.headers.get('Authorization')).toBe('Bearer dev-fake-access-token');
    request.flush({});
  });

  it('does not add fake token in production when no token exists', () => {
    // ARRANGE
    (environment as { production: boolean }).production = true;

    // ACT
    httpClient.get('/api/no-auth-in-production').subscribe();
    const request = httpTestingController.expectOne('/api/no-auth-in-production');

    // ASSERT
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({});
  });

  it('keeps existing authorization header unchanged', () => {
    // ARRANGE
    sessionStorage.setItem('access_token', 'session-token');

    // ACT
    httpClient
      .get('/api/keep-header', {
        headers: {
          Authorization: 'Bearer existing-token',
        },
      })
      .subscribe();
    const request = httpTestingController.expectOne('/api/keep-header');

    // ASSERT
    expect(request.request.headers.get('Authorization')).toBe('Bearer existing-token');
    request.flush({});
  });
});
