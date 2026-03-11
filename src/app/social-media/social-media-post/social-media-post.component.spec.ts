import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideTranslateService } from '@ngx-translate/core';

import { SocialMediaPostComponent } from '@app/social-media/social-media-post/social-media-post.component';

import type { SocialMediaPost } from '@app/social-media/models';

describe('SocialMediaPostComponent', () => {
  let component: SocialMediaPostComponent;
  let fixture: ComponentFixture<SocialMediaPostComponent>;

  const postMock: SocialMediaPost = {
    id: 'post-001',
    avatarUrl: 'https://i.pravatar.cc/80?img=1',
    content: 'This is a post for testing.',
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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SocialMediaPostComponent],
      providers: [provideTranslateService()],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialMediaPostComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('post', postMock);
    fixture.detectChanges();
  });

  it('should create', () => {
    // ARRANGE

    // ACT

    // ASSERT
    expect(component).toBeTruthy();
  });

  it('should render post author and content', () => {
    // ARRANGE

    // ACT
    const renderedText = fixture.nativeElement.textContent as string;

    // ASSERT
    expect(renderedText).toContain('David Prieto');
    expect(renderedText).toContain('@davidp');
    expect(renderedText).toContain('This is a post for testing.');
  });
});
