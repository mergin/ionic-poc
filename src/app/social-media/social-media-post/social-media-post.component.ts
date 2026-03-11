import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { IonAvatar, IonItem, IonLabel, IonNote, IonText } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs';

import type { SocialMediaPost } from '@app/social-media/models';
import { SocialMediaButtonsComponent } from '@app/social-media/social-media-buttons';

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
    SocialMediaButtonsComponent,
  ],
})
export class SocialMediaPostComponent {
  private readonly translateService = inject(TranslateService);

  private readonly activeLanguage = toSignal(
    this.translateService.onLangChange.pipe(
      map(event => event.lang),
      startWith(
        this.translateService.getCurrentLang() || this.translateService.getFallbackLang() || 'en',
      ),
    ),
    { initialValue: this.translateService.getCurrentLang() || 'en' },
  );

  /**
   * Post content rendered by this feed item.
   */
  readonly post = input.required<SocialMediaPost>();

  /**
   * Emits when this post requests a repost action.
   */
  readonly repostRequested = output<string>();

  /**
   * Emits when this post requests a like action.
   */
  readonly likeRequested = output<string>();

  protected readonly activeLocale = computed(() =>
    this.activeLanguage().startsWith('es') ? 'es-ES' : 'en-US',
  );

  /**
   * Emits the current post id for repost handling upstream.
   * @returns void
   */
  protected onRepostRequested(): void {
    this.repostRequested.emit(this.post().id);
  }

  /**
   * Emits the current post id for like handling upstream.
   * @returns void
   */
  protected onLikeRequested(): void {
    this.likeRequested.emit(this.post().id);
  }
}
