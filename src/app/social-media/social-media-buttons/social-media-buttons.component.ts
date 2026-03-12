import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { TranslatePipe } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { heart, repeat } from 'ionicons/icons';

@Component({
  selector: 'social-media-buttons',
  templateUrl: './social-media-buttons.component.html',
  styleUrls: ['./social-media-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonButton, IonButtons, IonIcon, TranslatePipe],
})
export class SocialMediaButtonsComponent {
  /**
   * Emits when the repost action button is activated.
   */
  readonly repostRequested = output<void>();

  /**
   * Emits when the like action button is activated.
   */
  readonly likeRequested = output<void>();

  /**
   * Creates the component and registers action icons.
   */
  constructor() {
    this.registerIcons();
  }

  /**
   * Registers icon assets used by action buttons.
   */
  private registerIcons(): void {
    addIcons({ heart, repeat });
  }

  /**
   * Handles repost button interactions.
   */
  protected requestRepost(): void {
    // TODO: Connect this event to a repost HTTP call in SocialMediaApiService.
    this.repostRequested.emit();
  }

  /**
   * Handles like button interactions.
   */
  protected requestLike(): void {
    // TODO: Connect this event to a like HTTP call in the feature container.
    this.likeRequested.emit();
  }
}
