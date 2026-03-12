/** Represents one image record returned by Lorem Picsum APIs. */
export interface PicsumImage {
  id: string;
  author: string;
  width: number;
  height: number;
  url: string;
  download_url: string;
}

/** Allowed output formats for dynamic image URLs. */
export type PicsumImageFormat = 'jpg' | 'webp';

/** Allowed blur intensity values for dynamic image URLs. */
export type PicsumBlurLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** Supported identifier types for Picsum image resources. */
export type PicsumImageId = string | number;

/** Query parameters accepted by the /v2/list endpoint. */
export interface PicsumListQuery {
  page?: number;
  limit?: number;
}

/** Shared options for dynamic image endpoints. */
export interface PicsumImageRequestOptions {
  width: number;
  height?: number;
  grayscale?: boolean;
  blur?: PicsumBlurLevel;
  random?: number;
  format?: PicsumImageFormat;
}
