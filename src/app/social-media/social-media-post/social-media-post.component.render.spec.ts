import { render, screen } from '@testing-library/angular';
import { provideTranslateService } from '@ngx-translate/core';

import type { SocialMediaPost } from '@app/social-media/models';
import { SocialMediaPostComponent } from '@app/social-media/social-media-post/social-media-post.component';

describe('SocialMediaPostComponent rendering', () => {
  it('should render author handle and post content', async () => {
    // ARRANGE
    const post: SocialMediaPost = {
      id: 'post-001',
      avatarUrl: 'https://i.pravatar.cc/80?img=1',
      content: 'Render spec post content',
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
    };

    await render(SocialMediaPostComponent, {
      componentInputs: { post },
      providers: [provideTranslateService()],
    });

    // ACT
    const author = screen.getByText('David Prieto');
    const handle = screen.getByText('@davidp');
    const content = screen.getByText('Render spec post content');

    // ASSERT
    expect(author).toBeTruthy();
    expect(handle).toBeTruthy();
    expect(content).toBeTruthy();
  });

  it('should expose avatar image with alt text', async () => {
    // ARRANGE
    const post: SocialMediaPost = {
      id: 'post-002',
      avatarUrl: 'https://i.pravatar.cc/80?img=2',
      content: 'Second render post',
      author: {
        id: 'user-002',
        handle: 'annag',
        displayName: 'Anna Gomez',
        avatarUrl: 'https://i.pravatar.cc/80?img=2',
      },
      timestamp: '2026-03-06T00:00:00.000Z',
      likes: 5,
      likedByMe: true,
      replies: 2,
      reposts: 1,
    };

    await render(SocialMediaPostComponent, {
      componentInputs: { post },
      providers: [provideTranslateService()],
    });

    // ACT
    const avatar = document.querySelector('img[ng-img]') as HTMLImageElement | null;

    // ASSERT
    expect(avatar).not.toBeNull();
    expect(avatar?.getAttribute('alt')).toBeTruthy();
  });
});
