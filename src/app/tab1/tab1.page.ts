import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonContent } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

import { HeaderComponent } from '@app/header/header.component';
import { SocialMediaComponent } from '@app/social-media/social-media.component';

@Component({
  selector: 'app-tab1',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonContent, TranslatePipe, SocialMediaComponent, HeaderComponent],
})
export class Tab1Page {
  /**
   * Creates the first tab page component.
   * @returns void
   */
  constructor() {}
}
