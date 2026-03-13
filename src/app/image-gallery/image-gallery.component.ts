import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { IonItem, IonLabel, IonList, IonImg } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { map } from 'rxjs';

import type { PicsumImage } from '@app/image-gallery/models';
import { PicsumService } from '@app/image-gallery/services';

@Component({
  selector: 'app-image-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
  imports: [IonItem, IonLabel, IonList, IonImg, TranslatePipe],
})
export class ImageGalleryComponent {
  private readonly picsumService = inject(PicsumService);
  protected readonly useMockPicsumApi = false;

  private readonly imagesResource = rxResource({
    defaultValue: [] as PicsumImage[],
    stream: () => {
      this.picsumService.setUseMockMsw(this.useMockPicsumApi);

      return this.picsumService
        .getImageList()
        .pipe(map(images => this.getRandomizedImages(images)));
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
   * Randomizes the order of image results from the list endpoint.
   * @param images Original list returned by Picsum.
   * @returns New list in randomized order.
   */
  private getRandomizedImages(images: PicsumImage[]): PicsumImage[] {
    return [...images].sort(() => Math.random() - Math.random());
  }
}
