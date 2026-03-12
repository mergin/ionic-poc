import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import type {
  PicsumImage,
  PicsumImageId,
  PicsumImageRequestOptions,
  PicsumListQuery,
} from '@app/image-gallery/models';
import { environment } from '@env/environment';

const PICSUM_BASE_URL = environment.apiUrls.picsumBaseUrl;
const PICSUM_API_MODE_QUERY_PARAM = '__msw';

/** Provides typed access to all public Lorem Picsum endpoints. */
@Injectable({ providedIn: 'root' })
export class PicsumService {
  private readonly httpClient = inject(HttpClient);
  private useMockMsw = false;

  /**
   * Sets whether requests should be served by MSW handlers or pass through to the real API.
   * @param useMockMsw True to use mock MSW handlers, false to use real Picsum API.
   */
  setUseMockMsw(useMockMsw: boolean): void {
    this.useMockMsw = useMockMsw;
  }

  /**
   * Fetches a paginated list of images from Lorem Picsum.
   * @param query Optional page and limit values for pagination.
   * @returns Stream with image metadata records.
   */
  getImageList(query: PicsumListQuery = {}): Observable<PicsumImage[]> {
    return this.httpClient.get<PicsumImage[]>(`${PICSUM_BASE_URL}/v2/list`, {
      params: this.createListQueryParams(query),
    });
  }

  /**
   * Fetches metadata for a specific image id.
   * @param imageId Image identifier from the Picsum catalog.
   * @returns Stream with a single image metadata record.
   */
  getImageInfoById(imageId: PicsumImageId): Observable<PicsumImage> {
    return this.httpClient.get<PicsumImage>(
      this.appendModeQueryParam(`${PICSUM_BASE_URL}/id/${imageId}/info`),
    );
  }

  /**
   * Fetches metadata for a seeded image.
   * @param seed Stable seed string for deterministic image selection.
   * @returns Stream with a single image metadata record.
   */
  getImageInfoBySeed(seed: string): Observable<PicsumImage> {
    return this.httpClient.get<PicsumImage>(
      this.appendModeQueryParam(`${PICSUM_BASE_URL}/seed/${encodeURIComponent(seed)}/info`),
    );
  }

  /**
   * Requests a random image as a Blob from Lorem Picsum.
   * @param options Size and rendering options.
   * @returns Stream with the resulting image blob.
   */
  getRandomImage(options: PicsumImageRequestOptions): Observable<Blob> {
    return this.httpClient.get(this.appendModeQueryParam(this.buildRandomImageUrl(options)), {
      responseType: 'blob',
    });
  }

  /**
   * Requests a specific image id as a Blob from Lorem Picsum.
   * @param imageId Image identifier from the Picsum catalog.
   * @param options Size and rendering options.
   * @returns Stream with the resulting image blob.
   */
  getImageById(imageId: PicsumImageId, options: PicsumImageRequestOptions): Observable<Blob> {
    return this.httpClient.get(
      this.appendModeQueryParam(this.buildImageByIdUrl(imageId, options)),
      {
        responseType: 'blob',
      },
    );
  }

  /**
   * Requests a seeded image as a Blob from Lorem Picsum.
   * @param seed Stable seed string for deterministic image selection.
   * @param options Size and rendering options.
   * @returns Stream with the resulting image blob.
   */
  getImageBySeed(seed: string, options: PicsumImageRequestOptions): Observable<Blob> {
    return this.httpClient.get(this.appendModeQueryParam(this.buildImageBySeedUrl(seed, options)), {
      responseType: 'blob',
    });
  }

  /**
   * Builds a random image URL with optional query flags.
   * @param options Size and rendering options.
   * @returns Fully-qualified random image URL.
   */
  buildRandomImageUrl(options: PicsumImageRequestOptions): string {
    const endpoint = `${PICSUM_BASE_URL}/${this.buildSizeSegment(options)}`;
    return this.appendImageOptions(endpoint, options);
  }

  /**
   * Builds a specific-id image URL with optional query flags.
   * @param imageId Image identifier from the Picsum catalog.
   * @param options Size and rendering options.
   * @returns Fully-qualified image URL for the provided id.
   */
  buildImageByIdUrl(imageId: PicsumImageId, options: PicsumImageRequestOptions): string {
    const endpoint = `${PICSUM_BASE_URL}/id/${imageId}/${this.buildSizeSegment(options)}`;
    return this.appendImageOptions(endpoint, options);
  }

  /**
   * Builds a seeded image URL with optional query flags.
   * @param seed Stable seed string for deterministic image selection.
   * @param options Size and rendering options.
   * @returns Fully-qualified image URL for the provided seed.
   */
  buildImageBySeedUrl(seed: string, options: PicsumImageRequestOptions): string {
    const endpoint = `${PICSUM_BASE_URL}/seed/${encodeURIComponent(seed)}/${this.buildSizeSegment(options)}`;
    return this.appendImageOptions(endpoint, options);
  }

  /**
   * Creates HttpParams for list endpoint query values.
   * @param query Optional list query values.
   * @returns HttpParams for request pagination.
   */
  private createListQueryParams(query: PicsumListQuery): HttpParams {
    let params = new HttpParams();

    if (query.page !== undefined) {
      params = params.set('page', String(query.page));
    }

    if (query.limit !== undefined) {
      params = params.set('limit', String(query.limit));
    }

    return params.set(PICSUM_API_MODE_QUERY_PARAM, this.useMockMsw ? 'mock' : 'real');
  }

  /**
   * Adds MSW mode query parameter to request URL.
   * @param url Request URL.
   * @returns URL with mode query parameter.
   */
  private appendModeQueryParam(url: string): string {
    const queryJoiner = url.includes('?') ? '&' : '?';
    return `${url}${queryJoiner}${PICSUM_API_MODE_QUERY_PARAM}=${this.useMockMsw ? 'mock' : 'real'}`;
  }

  /**
   * Builds the width/height path segment for image endpoints.
   * @param options Size and rendering options.
   * @returns Size segment used in Picsum image URLs.
   */
  private buildSizeSegment(options: PicsumImageRequestOptions): string {
    const baseSize =
      options.height === undefined ? `${options.width}` : `${options.width}/${options.height}`;

    if (options.format === undefined) {
      return baseSize;
    }

    return `${baseSize}.${options.format}`;
  }

  /**
   * Appends grayscale, blur, and random query options to an endpoint URL.
   * @param endpoint Base endpoint URL.
   * @param options Size and rendering options.
   * @returns URL with appended query string when options are present.
   */
  private appendImageOptions(endpoint: string, options: PicsumImageRequestOptions): string {
    const queryParts: string[] = [];

    if (options.grayscale) {
      queryParts.push('grayscale');
    }

    if (options.blur !== undefined) {
      queryParts.push(`blur=${options.blur}`);
    }

    if (options.random !== undefined) {
      queryParts.push(`random=${options.random}`);
    }

    if (queryParts.length === 0) {
      return endpoint;
    }

    return `${endpoint}?${queryParts.join('&')}`;
  }
}
