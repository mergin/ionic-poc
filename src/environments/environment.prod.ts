export const environment = {
  production: true,
  auth: {
    sessionStorageTokenKey: 'access_token',
    cookieTokenKey: 'access_token',
    developmentFakeToken: 'dev-fake-access-token',
  },
  apiErrorRetry: {
    maxAttempts: 2,
    baseDelayMs: 500,
  },
  apiErrorToast: {
    durationMs: 4500,
  },
  apiUrls: {
    picsumBaseUrl: '/picsum',
    openWeatherBaseUrl: 'https://api.openweathermap.org/data/2.5',
  },
  apiKeys: {
    openWeatherApiKey: 'demo-open-weather-key',
  },
};
