import { render, screen } from '@testing-library/angular';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { Tab1Page } from '@app/tab1/tab1.page';
import { SocialMediaApiService } from '@app/social-media/services';
import { SocialMediaApiServiceSpy } from '@app/social-media/services/social-media-api/social-media-api.service.spy';

describe('Tab1Page rendering', () => {
  it('should render social media feed container', async () => {
    // ARRANGE
    const socialMediaApiServiceSpy = SocialMediaApiServiceSpy.create();
    socialMediaApiServiceSpy.getPosts.and.returnValue(of([]));

    await render(Tab1Page, {
      providers: [
        provideTranslateService(),
        { provide: SocialMediaApiService, useValue: socialMediaApiServiceSpy },
      ],
    });

    // ACT
    const feed = await screen.findByLabelText('social.feedAriaLabel', {
      selector: 'ion-list',
    });

    // ASSERT
    expect(feed).toBeTruthy();
  });
});
