export const environment = {
  production: true,
  apiErrorRetry: {
    maxAttempts: 2,
    baseDelayMs: 500,
  },
  apiErrorToast: {
    durationMs: 4500,
  },
};
