import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import { IonItem, IonLabel, IonList } from '@ionic/angular/standalone';

import type { SocialMediaPost } from '@app/social-media/models';
import { SocialMediaPostComponent } from '@app/social-media/social-media-post';
import { SocialMediaApiService } from '@app/social-media/services';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonItem, IonLabel, IonList, SocialMediaPostComponent, TranslatePipe],
})
export class SocialMediaComponent {
  private readonly socialMediaApiService = inject(SocialMediaApiService);
  private readonly likeRequest = signal<{ postId: string; nonce: number } | undefined>(undefined);

  private readonly postsResource = rxResource({
    defaultValue: [] as SocialMediaPost[],
    stream: () => this.socialMediaApiService.getPosts(),
  });

  private readonly likedPostResource = rxResource({
    params: () => this.likeRequest(),
    stream: ({ params }) => this.socialMediaApiService.likePost(params.postId),
  });

  protected readonly posts = computed(() => {
    const likedPost = this.likedPostResource.value();

    if (likedPost === undefined) {
      return this.postsResource.value();
    }

    return this.postsResource.value().map(post => (post.id === likedPost.id ? likedPost : post));
  });
  protected readonly loading = computed(() => this.postsResource.isLoading());
  protected readonly errorMessageKey = computed(() =>
    this.postsResource.status() === 'error' ? 'social.loadError' : null,
  );

  /**
   * Likes a post and updates it in local component state.
   * @param postId Unique post identifier.
   */
  protected likePost(postId: string): void {
    this.likeRequest.update(request => ({
      postId,
      nonce: request === undefined ? 1 : request.nonce + 1,
    }));
  }

  /**
   * Handles repost requests from post action controls.
   * @param postId Unique post identifier.
   */
  protected repostPost(postId: string): void {
    // TODO: Connect repost action to SocialMediaApiService once repost endpoint is available.
    void postId;
  }
}
