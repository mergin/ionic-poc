import { setupWorker } from 'msw/browser';
import { handlers } from '@mocks/handlers';

export const worker = setupWorker(...handlers);

let isWorkerStarted = false;

function getServiceWorkerUrl(): string {
  const globalWindow = window as Window & { __karma__?: unknown };
  return globalWindow.__karma__ ? '/base/src/mockServiceWorker.js' : '/mockServiceWorker.js';
}

export async function startMockWorker(): Promise<void> {
  if (isWorkerStarted) {
    return;
  }

  await worker.start({
    onUnhandledRequest: 'bypass',
    serviceWorker: {
      url: getServiceWorkerUrl(),
    },
  });

  isWorkerStarted = true;
}

export async function stopMockWorker(): Promise<void> {
  if (!isWorkerStarted) {
    return;
  }

  await worker.stop();
  isWorkerStarted = false;
}
