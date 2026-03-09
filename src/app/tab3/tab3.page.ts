import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

import { HeaderComponent } from '@app/header/header.component';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-tab3',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  imports: [IonContent, ExploreContainerComponent, TranslatePipe, HeaderComponent],
})
export class Tab3Page {
  /**
   * Creates the third tab page component.
   * @returns void
   */
  constructor() {}
}
