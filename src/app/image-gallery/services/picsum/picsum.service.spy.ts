import { PicsumService } from '@app/image-gallery/services/picsum/picsum.service';

/** Factory for a fully-spied PicsumService test double. */
export class PicsumServiceSpy {
  /**
   * Creates a Jasmine spy object for PicsumService public methods.
   * @returns Typed service spy instance.
   */
  static create(): jasmine.SpyObj<PicsumService> {
    return jasmine.createSpyObj<PicsumService>('PicsumService', [
      'setUseMockMsw',
      'getImageList',
      'getImageInfoById',
      'getImageInfoBySeed',
      'getRandomImage',
      'getImageById',
      'getImageBySeed',
      'buildRandomImageUrl',
      'buildImageByIdUrl',
      'buildImageBySeedUrl',
    ]);
  }
}
