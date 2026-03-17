import { render, screen } from '@testing-library/angular';
import { provideTranslateService } from '@ngx-translate/core';
import { NEVER, of, throwError } from 'rxjs';

import { ImageGalleryComponent } from '@app/image-gallery/image-gallery.component';
import { PicsumService } from '@app/image-gallery/services';
import { PicsumServiceSpy } from '@app/image-gallery/services/picsum/picsum.service.spy';

describe('ImageGalleryComponent rendering', () => {
  it('should render images from the service', async () => {
    // ARRANGE
    const picsumServiceSpy = PicsumServiceSpy.create();
    picsumServiceSpy.getImageList.and.returnValue(
      of([
        {
          id: '10',
          author: 'Alejandro Escamilla',
          width: 2500,
          height: 1667,
          url: 'https://unsplash.com/photos/example-10',
          download_url: 'https://picsum.photos/id/10/2500/1667',
        },
      ]),
    );

    await render(ImageGalleryComponent, {
      providers: [
        provideTranslateService(),
        { provide: PicsumService, useValue: picsumServiceSpy },
      ],
    });

    // ACT
    const feed = await screen.findByLabelText('gallery.feedAriaLabel', {
      selector: 'ion-list',
    });
    const image = document.querySelector('ion-img');

    // ASSERT
    expect(feed).toBeTruthy();
    expect(image).toBeTruthy();
  });

  it('should render semantic gallery list and list items', async () => {
    // ARRANGE
    const picsumServiceSpy = PicsumServiceSpy.create();
    picsumServiceSpy.getImageList.and.returnValue(
      of([
        {
          id: '10',
          author: 'Alejandro Escamilla',
          width: 2500,
          height: 1667,
          url: 'https://unsplash.com/photos/example-10',
          download_url: 'https://picsum.photos/id/10/2500/1667',
        },
      ]),
    );

    await render(ImageGalleryComponent, {
      providers: [
        provideTranslateService(),
        { provide: PicsumService, useValue: picsumServiceSpy },
      ],
    });

    // ACT
    const semanticList = await screen.findByLabelText('gallery.feedAriaLabel', {
      selector: 'ion-list',
    });
    const firstCard = document.querySelector('.gallery-card[role="listitem"]');
    const firstImage = document.querySelector('ion-img.gallery-image');
    const semanticRole = semanticList.getAttribute('role');

    // ASSERT
    expect(semanticList).toBeTruthy();
    expect(semanticRole).toBe('list');
    expect(firstCard).toBeTruthy();
    expect(firstImage).toBeTruthy();
  });

  it('should render loading state while request is pending', async () => {
    // ARRANGE
    const picsumServiceSpy = PicsumServiceSpy.create();
    picsumServiceSpy.getImageList.and.returnValue(NEVER);

    await render(ImageGalleryComponent, {
      providers: [
        provideTranslateService(),
        { provide: PicsumService, useValue: picsumServiceSpy },
      ],
    });

    // ACT
    const loadingLabel = screen.getByText('gallery.loading');
    const loadingLiveRegion = document.querySelector('ion-item[role="status"][aria-live="polite"]');

    // ASSERT
    expect(loadingLabel).toBeTruthy();
    expect(loadingLiveRegion).toBeTruthy();
  });

  it('should render error state when image loading fails', async () => {
    // ARRANGE
    const picsumServiceSpy = PicsumServiceSpy.create();
    picsumServiceSpy.getImageList.and.returnValue(
      throwError(() => new Error('Failed to load images')),
    );

    await render(ImageGalleryComponent, {
      providers: [
        provideTranslateService(),
        { provide: PicsumService, useValue: picsumServiceSpy },
      ],
    });

    // ACT
    const errorLabel = await screen.findByText('gallery.loadError');
    const errorLiveRegion = document.querySelector('ion-item[role="alert"][aria-live="assertive"]');

    // ASSERT
    expect(errorLabel).toBeTruthy();
    expect(errorLiveRegion).toBeTruthy();
  });
});
