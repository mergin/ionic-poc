import type { PicsumImage } from './picsum.model';

/** View model state for image gallery content and request status. */
export interface ImageGalleryState {
  images: PicsumImage[];
  loading: boolean;
  errorMessageKey: string | null;
}
