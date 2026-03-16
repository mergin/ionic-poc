import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { TranslatePipe } from '@ngx-translate/core';
import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/angular/standalone';
import type { RefresherCustomEvent } from '@ionic/core';
import { finalize } from 'rxjs';

import type { SocialMediaPost } from '@app/social-media/models';
import { SocialMediaPostComponent } from '@app/social-media/social-media-post';
import { SocialMediaApiService } from '@app/social-media/services';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonRefresherContent,
    IonRefresher,
    IonContent,
    IonItem,
    IonLabel,
    IonList,
    SocialMediaPostComponent,
    TranslatePipe,
  ],
})
export class SocialMediaComponent {
  private readonly socialMediaApiService = inject(SocialMediaApiService);
  private readonly refreshNonce = signal(0);
  private readonly refreshCompleteByNonce = signal(new Map<number, () => Promise<void>>());
  private readonly likeRequest = signal<{ postId: string; nonce: number } | undefined>(undefined);

  private readonly postsResource = rxResource({
    defaultValue: [] as SocialMediaPost[],
    params: () => this.refreshNonce(),
    stream: ({ params }) => {
      const requestNonce = params;

      return this.socialMediaApiService.getPosts().pipe(
        finalize(() => {
          const completeRefresh = this.refreshCompleteByNonce().get(requestNonce);

          if (completeRefresh !== undefined) {
            void completeRefresh();
            this.refreshCompleteByNonce.update(previousMap => {
              const nextMap = new Map(previousMap);
              nextMap.delete(requestNonce);
              return nextMap;
            });
          }
        }),
      );
    },
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
   * Handles pull-to-refresh by requesting a new feed fetch and deferring completion.
   * @param event Custom refresher event emitted by ion-refresher.
   */
  protected handleRefresh(event: RefresherCustomEvent): void {
    const nextNonce = this.refreshNonce() + 1;

    this.refreshCompleteByNonce.update(previousMap => {
      const nextMap = new Map(previousMap);
      nextMap.set(nextNonce, () => event.target.complete());
      return nextMap;
    });

    this.refreshNonce.set(nextNonce);
  }

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
