import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import type { SocialMediaPost } from '@app/social-media/models';

const BASE = 'https://api-gateway.example.com/v1/social/posts';

/** Provides API access for social media posts. */
@Injectable({ providedIn: 'root' })
export class SocialMediaApiService {
  private readonly httpClient = inject(HttpClient);

  /**
   * Fetches all posts ordered by API default sorting.
   * @returns Stream with all social media posts.
   */
  getPosts(): Observable<SocialMediaPost[]> {
    return this.httpClient.get<SocialMediaPost[]>(BASE);
  }

  /**
   * Fetches one post by unique identifier.
   * @param postId Unique post identifier.
   * @returns Stream with the selected post.
   */
  getPostById(postId: string): Observable<SocialMediaPost> {
    return this.httpClient.get<SocialMediaPost>(`${BASE}/${postId}`);
  }

  /**
   * Likes a post and returns its updated state.
   * @param postId Unique post identifier.
   * @returns Stream with the updated post data.
   */
  likePost(postId: string): Observable<SocialMediaPost> {
    return this.httpClient.post<SocialMediaPost>(`${BASE}/${postId}/likes`, {});
  }
}
