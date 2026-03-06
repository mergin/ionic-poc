import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguageSwitcherComponent } from '@app/language-switcher/language-switcher.component';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-tab2',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    ExploreContainerComponent,
    TranslatePipe,
    LanguageSwitcherComponent,
  ],
})
export class Tab2Page {
  constructor() {}
}
