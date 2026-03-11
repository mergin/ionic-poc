import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { IonAvatar, IonItem, IonLabel, IonNote, IonText } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';

import type { SocialMediaPost } from '@app/social-media/models';

@Component({
  selector: 'social-media-post',
  templateUrl: './social-media-post.component.html',
  styleUrls: ['./social-media-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    IonAvatar,
    IonItem,
    IonLabel,
    IonNote,
    IonText,
    NgOptimizedImage,
    TranslatePipe,
  ],
})
export class SocialMediaPostComponent {
  /**
   * Post content rendered by this feed item.
   */
  readonly post = input.required<SocialMediaPost>();
}
