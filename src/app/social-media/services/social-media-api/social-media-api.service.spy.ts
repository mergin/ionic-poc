import { SocialMediaApiService } from '@app/social-media/services/social-media-api/social-media-api.service';

/** Factory for a fully-spied SocialMediaApiService test double. */
export class SocialMediaApiServiceSpy {
  static create(): jasmine.SpyObj<SocialMediaApiService> {
    return jasmine.createSpyObj<SocialMediaApiService>('SocialMediaApiService', [
      'getPosts',
      'getPostById',
      'likePost',
    ]);
  }
}
