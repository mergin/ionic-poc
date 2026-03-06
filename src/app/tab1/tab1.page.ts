import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguageSwitcherComponent } from '@app/language-switcher/language-switcher.component';
import { SocialMediaComponent } from '@app/social-media/social-media.component';

@Component({
  selector: 'app-tab1',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    SocialMediaComponent,
    TranslatePipe,
    LanguageSwitcherComponent,
  ],
})
export class Tab1Page {
  constructor() {}
}
