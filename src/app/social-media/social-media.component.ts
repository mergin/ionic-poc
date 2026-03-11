import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { take } from 'rxjs';
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
export class SocialMediaComponent implements OnInit {
  private readonly socialMediaApiService = inject(SocialMediaApiService);

  protected readonly posts = signal<SocialMediaPost[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessageKey = signal<string | null>(null);

  /**
   * Initializes the component by loading social media posts.
   * @returns void
   */
  ngOnInit(): void {
    this.loadPosts();
  }

  /**
   * Likes a post and updates it in local component state.
   * @param postId Unique post identifier.
   * @returns void
   */
  protected likePost(postId: string): void {
    this.socialMediaApiService
      .likePost(postId)
      .pipe(take(1))
      .subscribe(updatedPost => {
        this.posts.update(posts =>
          posts.map(post => (post.id === updatedPost.id ? updatedPost : post)),
        );
      });
  }

  /**
   * Handles repost requests from post action controls.
   * @param postId Unique post identifier.
   * @returns void
   */
  protected repostPost(postId: string): void {
    // TODO: Connect repost action to SocialMediaApiService once repost endpoint is available.
    void postId;
  }

  /**
   * Loads posts from the API and updates loading/error signals.
   * @returns void
   */
  private loadPosts(): void {
    this.loading.set(true);
    this.errorMessageKey.set(null);

    this.socialMediaApiService
      .getPosts()
      .pipe(take(1))
      .subscribe({
        next: posts => {
          this.posts.set(posts);
          this.loading.set(false);
        },
        error: () => {
          this.errorMessageKey.set('social.loadError');
          this.loading.set(false);
        },
      });
  }
}
