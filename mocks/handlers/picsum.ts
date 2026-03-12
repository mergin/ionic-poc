import { delay, http, HttpResponse, passthrough } from 'msw';

interface MockPicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

const PICSUM_BASE = '/picsum';
const PICSUM_API_MODE_QUERY_PARAM = '__msw';

const DEFAULTS = {
  page: 1,
  limit: 30,
  shortDelayMs: 120,
  mediumDelayMs: 200,
  maxBlur: 10,
} as const;

const mockPicsumImages: MockPicsumImage[] = [
  {
    id: '0',
    author: 'Alejandro Escamilla',
    width: 5616,
    height: 3744,
    url: 'https://unsplash.com/photos/yC-Yzbqy7PY',
    download_url: `${PICSUM_BASE}/id/0/5616/3744`,
  },
  {
    id: '10',
    author: 'Paul Jarvis',
    width: 2500,
    height: 1667,
    url: 'https://unsplash.com/photos/6J--NXulQCs',
    download_url: `${PICSUM_BASE}/id/10/2500/1667`,
  },
  {
    id: '100',
    author: 'Duy Pham',
    width: 2500,
    height: 1656,
    url: 'https://unsplash.com/photos/mEZ3PoFGs_k',
    download_url: `${PICSUM_BASE}/id/100/2500/1656`,
  },
  {
    id: '102',
    author: 'E+N Photographies',
    width: 4320,
    height: 3240,
    url: 'https://unsplash.com/photos/6J--NXulQCs',
    download_url: `${PICSUM_BASE}/id/102/4320/3240`,
  },
  {
    id: '237',
    author: 'Alejandro Escamilla',
    width: 3500,
    height: 2091,
    url: 'https://unsplash.com/photos/puppy',
    download_url: `${PICSUM_BASE}/id/237/3500/2091`,
  },
  {
    id: '870',
    author: 'Djurovic',
    width: 3000,
    height: 2000,
    url: 'https://unsplash.com/photos/scenic',
    download_url: `${PICSUM_BASE}/id/870/3000/2000`,
  },
];

/**
 * Parses an integer query parameter and applies a fallback value when invalid.
 * @param value String value from URL search params.
 * @param fallback Fallback integer when parsing fails.
 * @returns Parsed integer or fallback value.
 */
function parseIntOrFallback(value: string | null, fallback: number): number {
  if (value === null) {
    return fallback;
  }

  const parsedValue = Number.parseInt(value, 10);
  if (Number.isNaN(parsedValue)) {
    return fallback;
  }

  return parsedValue;
}

/**
 * Gets one image record by id from the mock catalog.
 * @param imageId Picsum image identifier.
 * @returns Image record when found.
 */
function findImageById(imageId: string): MockPicsumImage | undefined {
  return mockPicsumImages.find(image => image.id === imageId);
}

/**
 * Picks a deterministic image from the mock catalog using a seed.
 * @param seed Stable seed value.
 * @returns Deterministically selected image record.
 */
function findImageBySeed(seed: string): MockPicsumImage {
  const hash = Array.from(seed).reduce((accumulator, character) => {
    return accumulator + character.charCodeAt(0);
  }, 0);
  const seedIndex = hash % mockPicsumImages.length;
  return mockPicsumImages[seedIndex] ?? mockPicsumImages[0];
}

/**
 * Resolves image mime type based on the file extension segment.
 * @param format Optional file extension from the request path.
 * @returns Mime type string for mocked image responses.
 */
function resolveImageMimeType(format: string | undefined): string {
  return format === 'webp' ? 'image/webp' : 'image/jpeg';
}

/**
 * Validates whether blur query parameter is in the supported range.
 * @param blurRaw Blur value from query params.
 * @returns True when blur value is valid or absent.
 */
function isBlurValid(blurRaw: string | null): boolean {
  if (blurRaw === null) {
    return true;
  }

  const blurValue = parseIntOrFallback(blurRaw, DEFAULTS.maxBlur + 1);
  return blurValue >= DEFAULTS.page && blurValue <= DEFAULTS.maxBlur;
}

/**
 * Creates a binary image response used by all dynamic image endpoints.
 * @param imageId Optional Picsum image id used for response metadata.
 * @param format Optional output extension from the request path.
 * @returns HTTP response containing image-like binary content.
 */
function createImageResponse(
  imageId: string | undefined,
  format: string | undefined,
): HttpResponse<string> {
  const mimeType = resolveImageMimeType(format);
  const imagePayload = `mock-image:${imageId ?? 'random'}:${format ?? 'jpg'}`;

  return new HttpResponse(imagePayload, {
    headers: {
      'Content-Type': mimeType,
      'Picsum-ID': imageId ?? findImageBySeed('random').id,
      'Cache-Control': 'public, max-age=60',
    },
  });
}

/**
 * Parses and validates shared dynamic image request query options.
 * @param requestUrl URL instance for the incoming request.
 * @returns Error response when query is invalid.
 */
function validateImageQuery(requestUrl: URL): HttpResponse<string> | undefined {
  if (!isBlurValid(requestUrl.searchParams.get('blur'))) {
    return HttpResponse.text('Blur must be an integer between 1 and 10.', { status: 400 });
  }

  return undefined;
}

/**
 * Checks whether request should bypass MSW and call the real Picsum API.
 * @param request Incoming HTTP request.
 * @returns True when request mode indicates real API passthrough.
 */
function shouldUseRealApi(request: Request): boolean {
  const requestUrl = new URL(request.url);
  return requestUrl.searchParams.get(PICSUM_API_MODE_QUERY_PARAM) === 'real';
}

export const picsumHandlers = [
  http.get(`${PICSUM_BASE}/v2/list`, async ({ request }) => {
    if (shouldUseRealApi(request)) {
      return passthrough();
    }

    await delay(DEFAULTS.mediumDelayMs);

    const requestUrl = new URL(request.url);
    const page = Math.max(
      DEFAULTS.page,
      parseIntOrFallback(requestUrl.searchParams.get('page'), DEFAULTS.page),
    );
    const limit = Math.max(
      DEFAULTS.page,
      parseIntOrFallback(requestUrl.searchParams.get('limit'), DEFAULTS.limit),
    );

    const startIndex = (page - DEFAULTS.page) * limit;
    const endIndex = startIndex + limit;
    const pageItems = mockPicsumImages.slice(startIndex, endIndex);

    return HttpResponse.json(pageItems, {
      headers: {
        Link: `<${PICSUM_BASE}/v2/list?page=${page + 1}&limit=${limit}>; rel="next"`,
      },
    });
  }),

  http.get(`${PICSUM_BASE}/id/:id/info`, async ({ params, request }) => {
    if (shouldUseRealApi(request)) {
      return passthrough();
    }

    await delay(DEFAULTS.shortDelayMs);

    const imageId = String(params['id']);
    const image = findImageById(imageId);
    if (!image) {
      return HttpResponse.json({ message: 'Image not found' }, { status: 404 });
    }

    return HttpResponse.json(image);
  }),

  http.get(`${PICSUM_BASE}/seed/:seed/info`, async ({ params, request }) => {
    if (shouldUseRealApi(request)) {
      return passthrough();
    }

    await delay(DEFAULTS.shortDelayMs);

    const seed = decodeURIComponent(String(params['seed']));
    return HttpResponse.json(findImageBySeed(seed));
  }),

  http.get(`${PICSUM_BASE}/:width`, async ({ request }) => {
    if (shouldUseRealApi(request)) {
      return passthrough();
    }

    await delay(DEFAULTS.shortDelayMs);

    const validationError = validateImageQuery(new URL(request.url));
    if (validationError) {
      return validationError;
    }

    return createImageResponse(undefined, undefined);
  }),

  http.get(`${PICSUM_BASE}/:width/:height`, async ({ request }) => {
    if (shouldUseRealApi(request)) {
      return passthrough();
    }

    await delay(DEFAULTS.shortDelayMs);

    const validationError = validateImageQuery(new URL(request.url));
    if (validationError) {
      return validationError;
    }

    return createImageResponse(undefined, undefined);
  }),

  http.get(`${PICSUM_BASE}/:width/:height.:format`, async ({ params, request }) => {
    if (shouldUseRealApi(request)) {
      return passthrough();
    }

    await delay(DEFAULTS.shortDelayMs);

    const validationError = validateImageQuery(new URL(request.url));
    if (validationError) {
      return validationError;
    }

    return createImageResponse(undefined, String(params['format']));
  }),

  http.get(`${PICSUM_BASE}/id/:id/:width`, async ({ params, request }) => {
    if (shouldUseRealApi(request)) {
      return passthrough();
    }

    await delay(DEFAULTS.shortDelayMs);

    const validationError = validateImageQuery(new URL(request.url));
    if (validationError) {
      return validationError;
    }

    return createImageResponse(String(params['id']), undefined);
  }),

  http.get(`${PICSUM_BASE}/id/:id/:width/:height`, async ({ params, request }) => {
    if (shouldUseRealApi(request)) {
      return passthrough();
    }

    await delay(DEFAULTS.shortDelayMs);

    const validationError = validateImageQuery(new URL(request.url));
    if (validationError) {
      return validationError;
    }

    return createImageResponse(String(params['id']), undefined);
  }),

  http.get(`${PICSUM_BASE}/id/:id/:width/:height.:format`, async ({ params, request }) => {
    if (shouldUseRealApi(request)) {
      return passthrough();
    }

    await delay(DEFAULTS.shortDelayMs);

    const validationError = validateImageQuery(new URL(request.url));
    if (validationError) {
      return validationError;
    }

    return createImageResponse(String(params['id']), String(params['format']));
  }),

  http.get(`${PICSUM_BASE}/seed/:seed/:width`, async ({ params, request }) => {
    if (shouldUseRealApi(request)) {
      return passthrough();
    }

    await delay(DEFAULTS.shortDelayMs);

    const validationError = validateImageQuery(new URL(request.url));
    if (validationError) {
      return validationError;
    }

    const seededImage = findImageBySeed(decodeURIComponent(String(params['seed'])));
    return createImageResponse(seededImage.id, undefined);
  }),

  http.get(`${PICSUM_BASE}/seed/:seed/:width/:height`, async ({ params, request }) => {
    if (shouldUseRealApi(request)) {
      return passthrough();
    }

    await delay(DEFAULTS.shortDelayMs);

    const validationError = validateImageQuery(new URL(request.url));
    if (validationError) {
      return validationError;
    }

    const seededImage = findImageBySeed(decodeURIComponent(String(params['seed'])));
    return createImageResponse(seededImage.id, undefined);
  }),

  http.get(`${PICSUM_BASE}/seed/:seed/:width/:height.:format`, async ({ params, request }) => {
    if (shouldUseRealApi(request)) {
      return passthrough();
    }

    await delay(DEFAULTS.shortDelayMs);

    const validationError = validateImageQuery(new URL(request.url));
    if (validationError) {
      return validationError;
    }

    const seededImage = findImageBySeed(decodeURIComponent(String(params['seed'])));
    return createImageResponse(seededImage.id, String(params['format']));
  }),
];
