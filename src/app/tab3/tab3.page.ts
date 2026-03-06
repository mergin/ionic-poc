import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

import { LanguageSwitcherComponent } from '@app/language-switcher/language-switcher.component';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';

@Component({
  selector: 'app-tab3',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
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
export class Tab3Page {
  constructor() {}
}
