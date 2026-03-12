import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { RefresherCustomEvent } from '@ionic/core';

import { ImageGalleryComponent } from '@app/image-gallery/image-gallery.component';

@Component({
  selector: 'app-tab2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonRefresherContent, IonRefresher, IonContent, ImageGalleryComponent],
})
export class Tab2Page {
  /**
   * Creates the second tab page component.
   */
  constructor() {}

  /**
   * Handles the refresh event triggered by the ion-refresher component. It simulates a data loading process by using a timeout of 2 seconds, after which it calls the complete method on the event target to signal that the refresh is complete.
   * @param event The custom event emitted by the ion-refresher component when a refresh is triggered. It contains the target property, which is used to call the complete method after the simulated data loading process is finished.
   */
  handleRefresh(event: RefresherCustomEvent): void {
    setTimeout(() => {
      // Any calls to load data go here
      event.target.complete();
      // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    }, 2000);
  }
}
