import { render, screen } from '@testing-library/angular';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { PicsumService } from '@app/image-gallery/services';
import { PicsumServiceSpy } from '@app/image-gallery/services/picsum/picsum.service.spy';

import { Tab2Page } from './tab2.page';

describe('Tab2Page rendering', () => {
  it('should render image gallery content', async () => {
    // ARRANGE
    const picsumServiceSpy = PicsumServiceSpy.create();
    picsumServiceSpy.getImageList.and.returnValue(of([]));

    await render(Tab2Page, {
      providers: [
        provideTranslateService(),
        { provide: PicsumService, useValue: picsumServiceSpy },
      ],
    });

    // ACT
    const galleryFeed = await screen.findByLabelText('gallery.feedAriaLabel');

    // ASSERT
    expect(galleryFeed).toBeTruthy();
  });
});
