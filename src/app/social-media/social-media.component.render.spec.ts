import { render, screen } from '@testing-library/angular';
import { provideTranslateService } from '@ngx-translate/core';
import { NEVER, of, throwError } from 'rxjs';

import { SocialMediaComponent } from '@app/social-media/social-media.component';
import type { SocialMediaPost } from '@app/social-media/models';
import { SocialMediaApiService } from '@app/social-media/services';
import { SocialMediaApiServiceSpy } from '@app/social-media/services/social-media-api/social-media-api.service.spy';

describe('SocialMediaComponent rendering', () => {
  it('should render posts from the service', async () => {
    // ARRANGE
    const socialMediaApiServiceSpy = SocialMediaApiServiceSpy.create();
    const posts: SocialMediaPost[] = [
      {
        id: 'post-001',
        avatarUrl: 'https://i.pravatar.cc/80?img=1',
        content: 'Post content',
        author: {
          id: 'user-001',
          handle: 'davidp',
          displayName: 'David Prieto',
          avatarUrl: 'https://i.pravatar.cc/80?img=1',
        },
        timestamp: '2026-03-05T00:00:00.000Z',
        likes: 1,
        likedByMe: false,
        replies: 0,
        reposts: 0,
      },
    ];
    socialMediaApiServiceSpy.getPosts.and.returnValue(of(posts));

    await render(SocialMediaComponent, {
      providers: [
        provideTranslateService(),
        { provide: SocialMediaApiService, useValue: socialMediaApiServiceSpy },
      ],
    });

    // ACT
    const feed = await screen.findByLabelText('social.feedAriaLabel', {
      selector: 'ion-list',
    });
    const author = await screen.findByText('David Prieto');

    // ASSERT
    expect(feed).toBeTruthy();
    expect(author).toBeTruthy();
  });

  it('should render semantic feed list and accessible post actions', async () => {
    // ARRANGE
    const socialMediaApiServiceSpy = SocialMediaApiServiceSpy.create();
    const posts: SocialMediaPost[] = [
      {
        id: 'post-001',
        avatarUrl: 'https://i.pravatar.cc/80?img=1',
        content: 'Post content',
        author: {
          id: 'user-001',
          handle: 'davidp',
          displayName: 'David Prieto',
          avatarUrl: 'https://i.pravatar.cc/80?img=1',
        },
        timestamp: '2026-03-05T00:00:00.000Z',
        likes: 1,
        likedByMe: false,
        replies: 0,
        reposts: 0,
      },
    ];
    socialMediaApiServiceSpy.getPosts.and.returnValue(of(posts));

    await render(SocialMediaComponent, {
      providers: [
        provideTranslateService(),
        { provide: SocialMediaApiService, useValue: socialMediaApiServiceSpy },
      ],
    });

    // ACT
    const semanticList = await screen.findByLabelText('social.feedAriaLabel', {
      selector: 'ion-list',
    });
    const listItem = document.querySelector('social-media-post[role="listitem"]');
    const actionGroup = document.querySelector(
      '[role="group"][aria-label="social.actionsAriaLabel"]',
    );
    const repostButton = document.querySelector('ion-button.repost-button');
    const favoriteButton = document.querySelector('ion-button.favorite-button');

    // ASSERT
    expect(semanticList).toBeTruthy();
    expect(listItem).toBeTruthy();
    expect(actionGroup).toBeTruthy();
    expect(repostButton).toBeTruthy();
    expect(favoriteButton).toBeTruthy();
  });

  it('should render loading state while request is pending', async () => {
    // ARRANGE
    const socialMediaApiServiceSpy = SocialMediaApiServiceSpy.create();
    socialMediaApiServiceSpy.getPosts.and.returnValue(NEVER);

    await render(SocialMediaComponent, {
      providers: [
        provideTranslateService(),
        { provide: SocialMediaApiService, useValue: socialMediaApiServiceSpy },
      ],
    });

    // ACT
    const loadingLabel = screen.getByText('social.loading');
    const loadingLiveRegion = document.querySelector('ion-item[role="status"][aria-live="polite"]');

    // ASSERT
    expect(loadingLabel).toBeTruthy();
    expect(loadingLiveRegion).toBeTruthy();
  });

  it('should render error state when post loading fails', async () => {
    // ARRANGE
    const socialMediaApiServiceSpy = SocialMediaApiServiceSpy.create();
    socialMediaApiServiceSpy.getPosts.and.returnValue(
      throwError(() => new Error('Failed to load posts')),
    );

    await render(SocialMediaComponent, {
      providers: [
        provideTranslateService(),
        { provide: SocialMediaApiService, useValue: socialMediaApiServiceSpy },
      ],
    });

    // ACT
    const errorLabel = await screen.findByText('social.loadError');
    const errorLiveRegion = document.querySelector('ion-item[role="alert"][aria-live="assertive"]');

    // ASSERT
    expect(errorLabel).toBeTruthy();
    expect(errorLiveRegion).toBeTruthy();
  });
});
