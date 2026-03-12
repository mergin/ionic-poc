import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  IonContent,
  IonRefresherContent,
  IonRefresher,
  RefresherCustomEvent,
} from '@ionic/angular/standalone';

import { SocialMediaComponent } from '@app/social-media/social-media.component';

@Component({
  selector: 'app-tab1',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonRefresher, IonRefresherContent, IonContent, SocialMediaComponent],
})
export class Tab1Page {
  /**
   * Creates the first tab page component.
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
