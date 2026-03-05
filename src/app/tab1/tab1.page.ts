import { ChangeDetectionStrategy, Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/angular/standalone';
import { SocialMediaComponent } from '../social-media/social-media.component';

@Component({
  selector: 'app-tab1',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, SocialMediaComponent],
})
export class Tab1Page {
  constructor() {}
}
