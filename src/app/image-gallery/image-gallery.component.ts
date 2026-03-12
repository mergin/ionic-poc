import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { IonItem, IonLabel, IonList, IonImg } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { take } from 'rxjs';

import type { PicsumImage } from '@app/image-gallery/models';
import { PicsumService } from '@app/image-gallery/services';

@Component({
  selector: 'app-image-gallery',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss'],
  imports: [IonItem, IonLabel, IonList, IonImg, TranslatePipe],
})
export class ImageGalleryComponent implements OnInit {
  private readonly picsumService = inject(PicsumService);
  protected readonly useMockPicsumApi = false;

  protected readonly images = signal<PicsumImage[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessageKey = signal<string | null>(null);

  /**
   * Initializes gallery content by loading random ordered images.
   */
  ngOnInit(): void {
    this.picsumService.setUseMockMsw(this.useMockPicsumApi);
    this.loadImages();
  }

  /**
   * Provides the image source URL for rendering.
   * @param image Image metadata item to render.
   * @returns URL that can be consumed by ion-img.
   */
  protected getImageSource(image: PicsumImage): string {
    return image.download_url;
  }

  /**
   * Loads images from Picsum and updates component state signals.
   */
  private loadImages(): void {
    this.loading.set(true);
    this.errorMessageKey.set(null);

    this.picsumService
      .getImageList()
      .pipe(take(1))
      .subscribe({
        next: images => {
          this.images.set(this.getRandomizedImages(images));
          this.loading.set(false);
        },
        error: () => {
          this.errorMessageKey.set('gallery.loadError');
          this.loading.set(false);
        },
      });
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
