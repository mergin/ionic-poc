import { SocialMediaApiService } from '@app/social-media/services/social-media-api/social-media-api.service';

/** Factory for a fully-spied SocialMediaApiService test double. */
export class SocialMediaApiServiceSpy {
  /**
   * Creates a Jasmine spy object for SocialMediaApiService public methods.
   * @returns Typed service spy instance.
   */
  static create(): jasmine.SpyObj<SocialMediaApiService> {
    return jasmine.createSpyObj<SocialMediaApiService>('SocialMediaApiService', [
      'getPosts',
      'getPostById',
      'likePost',
    ]);
  }
}
