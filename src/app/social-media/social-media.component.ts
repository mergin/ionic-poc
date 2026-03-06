import { DatePipe, NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { take } from 'rxjs';
import {
  IonCardTitle,
  IonList,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonLabel,
  IonButton,
  IonCardSubtitle,
  IonAvatar,
} from '@ionic/angular/standalone';

import type { SocialMediaPost } from '@app/social-media/models';
import { SocialMediaApiService } from '@app/social-media/services';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    TranslatePipe,
    NgOptimizedImage,
    IonAvatar,
    IonCardSubtitle,
    IonButton,
    IonLabel,
    IonCardContent,
    IonCardHeader,
    IonCard,
    IonItem,
    IonList,
    IonCardTitle,
  ],
})
export class SocialMediaComponent implements OnInit {
  private readonly socialMediaApiService = inject(SocialMediaApiService);

  protected readonly posts = signal<SocialMediaPost[]>([]);
  protected readonly loading = signal(false);
  protected readonly errorMessageKey = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPosts();
  }

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
