import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';

import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-tab2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonContent, ExploreContainerComponent],
})
export class Tab2Page {
  /**
   * Creates the second tab page component.
   * @returns void
   */
  constructor() {}
}
