import { render } from '@testing-library/angular';
import { provideTranslateService } from '@ngx-translate/core';

import { SocialMediaButtonsComponent } from '@app/social-media/social-media-buttons/social-media-buttons.component';

describe('SocialMediaButtonsComponent rendering', () => {
  it('should render repost and favorite action buttons', async () => {
    // ARRANGE
    await render(SocialMediaButtonsComponent, {
      providers: [provideTranslateService()],
    });

    // ACT
    const repostButton = document.querySelector('ion-button.repost-button');
    const favoriteButton = document.querySelector('ion-button.favorite-button');
    const repostIcon = document.querySelector('ion-button.repost-button ion-icon[name="repeat"]');
    const favoriteIcon = document.querySelector(
      'ion-button.favorite-button ion-icon[name="heart"]',
    );

    // ASSERT
    expect(repostButton).not.toBeNull();
    expect(favoriteButton).not.toBeNull();
    expect(repostIcon).not.toBeNull();
    expect(favoriteIcon).not.toBeNull();
  });
});
