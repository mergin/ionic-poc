import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

import { HeaderComponent } from '@app/header/header.component';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-tab2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [IonContent, ExploreContainerComponent, TranslatePipe, HeaderComponent],
})
export class Tab2Page {
  /**
   * Creates the second tab page component.
   * @returns void
   */
  constructor() {}
}
