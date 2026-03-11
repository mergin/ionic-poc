import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonAvatar, IonItem, IonLabel, IonNote, IonText } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs';

import type { SocialMediaPost } from '@app/social-media/models';

@Component({
  selector: 'social-media-post',
  templateUrl: './social-media-post.component.html',
  styleUrls: ['./social-media-post.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe, IonAvatar, IonItem, IonLabel, IonNote, IonText, NgOptimizedImage],
})
export class SocialMediaPostComponent {
  private readonly translateService = inject(TranslateService);

  private readonly activeLanguage = toSignal(
    this.translateService.onLangChange.pipe(
      map(event => event.lang),
      startWith(
        this.translateService.currentLang || this.translateService.getFallbackLang() || 'en',
      ),
    ),
    { initialValue: this.translateService.currentLang || 'en' },
  );

  /**
   * Post content rendered by this feed item.
   */
  readonly post = input.required<SocialMediaPost>();

  protected readonly activeLocale = computed(() =>
    this.activeLanguage().startsWith('es') ? 'es-ES' : 'en-US',
  );
}
