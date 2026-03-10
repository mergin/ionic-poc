import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

import { SocialMediaComponent } from '@app/social-media/social-media.component';

@Component({
  selector: 'app-tab1',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonContent, SocialMediaComponent],
})
export class Tab1Page {
  /**
   * Creates the first tab page component.
   * @returns void
   */
  constructor() {}
}
