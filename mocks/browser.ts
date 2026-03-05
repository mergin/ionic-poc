import { setupWorker } from 'msw/browser';
import { socialMediaHandlers } from '@mocks/handlers';

export const worker = setupWorker(...socialMediaHandlers);

export async function startMockWorker(): Promise<void> {
  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: '/mockServiceWorker.js',
    },
  });
}
