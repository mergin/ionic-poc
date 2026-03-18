import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonImg,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import type { RefresherCustomEvent } from '@ionic/core';
import { TranslatePipe } from '@ngx-translate/core';
import { finalize, map } from 'rxjs';

import type { PicsumImage } from '@app/image-gallery/models';
import { PicsumService } from '@app/image-gallery/services';

@Component({
  selector: 'app-image-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
  imports: [
    IonSkeletonText,
    IonRefresherContent,
    IonRefresher,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    IonImg,
    TranslatePipe,
  ],
})
export class ImageGalleryComponent {
  private readonly picsumService = inject(PicsumService);
  private readonly refreshNonce = signal(0);
  private readonly refreshCompleteByNonce = signal(new Map<number, () => Promise<void>>());

  protected readonly useMockPicsumApi = false;
  private readonly loadedImageIds = signal<Set<string>>(new Set());

  /**
   * Creates the gallery component and configures request mode routing.
   */
  constructor() {
    this.picsumService.setUseMockMsw(this.useMockPicsumApi);
  }

  /**
   * Reactive image collection resource that fetches gallery data and finalizes pending refresher callbacks.
   */
  private readonly imagesResource = rxResource({
    defaultValue: [] as PicsumImage[],
    params: () => this.refreshNonce(),
    stream: ({ params }) => {
      const requestNonce = params;

      return this.picsumService.getImageList().pipe(
        map(images => this.getRandomizedImages(images)),
        finalize(() => {
          const completeRefresh = this.refreshCompleteByNonce().get(requestNonce);

          if (completeRefresh !== undefined) {
            void completeRefresh();
            this.refreshCompleteByNonce.update(previousMap => {
              const nextMap = new Map(previousMap);
              nextMap.delete(requestNonce);
              return nextMap;
            });
          }
        }),
      );
    },
  });

  protected readonly images = computed(() => this.imagesResource.value());
  protected readonly loading = computed(() => this.imagesResource.isLoading());
  protected readonly errorMessageKey = computed(() =>
    this.imagesResource.status() === 'error' ? 'gallery.loadError' : null,
  );

  /**
   * Provides the image source URL for rendering.
   * @param image Image metadata item to render.
   * @returns URL that can be consumed by ion-img.
   */
  protected getImageSource(image: PicsumImage): string {
    return image.download_url;
  }

  /**
   * Marks an image as settled after load or error to hide its skeleton placeholder.
   * @param imageId Unique image identifier.
   */
  protected onImageSettled(imageId: string): void {
    this.loadedImageIds.update(previous => new Set([...previous, imageId]));
  }

  /**
   * Indicates whether an image has finished loading (or errored) and can hide its skeleton.
   * @param imageId Unique image identifier.
   * @returns True when the image is already settled.
   */
  protected isImageLoaded(imageId: string): boolean {
    return this.loadedImageIds().has(imageId);
  }

  /**
   * Handles pull-to-refresh by requesting a new gallery fetch and deferring completion.
   * @param event Custom refresher event emitted by ion-refresher.
   */
  protected handleRefresh(event: RefresherCustomEvent): void {
    const nextNonce = this.refreshNonce() + 1;

    this.refreshCompleteByNonce.update(previousMap => {
      const nextMap = new Map(previousMap);
      nextMap.set(nextNonce, () => event.target.complete());
      return nextMap;
    });

    this.loadedImageIds.set(new Set());
    this.refreshNonce.set(nextNonce);
  }

  /**
   * Randomizes the order of image results from the list endpoint using Fisher-Yates shuffle.
   * @param images Original list returned by Picsum.
   * @returns New list in randomized order.
   */
  private getRandomizedImages(images: PicsumImage[]): PicsumImage[] {
    return images.reduceRight(
      (accumulator, _image, index) => {
        if (index === 0) {
          return accumulator;
        }

        const randomIndex = Math.floor(Math.random() * (index + 1));
        const currentImage = accumulator[index];
        accumulator[index] = accumulator[randomIndex];
        accumulator[randomIndex] = currentImage;

        return accumulator;
      },
      [...images],
    );
  }
}
