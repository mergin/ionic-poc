import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { provideTranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';

import { SocialMediaComponent } from '@app/social-media/social-media.component';
import type { SocialMediaPost } from '@app/social-media/models';
import { SocialMediaApiService } from '@app/social-media/services';
import { SocialMediaApiServiceSpy } from '@app/social-media/services/social-media-api/social-media-api.service.spy';

describe('SocialMediaComponent', () => {
  let component: SocialMediaComponent;
  let fixture: ComponentFixture<SocialMediaComponent>;
  let socialMediaApiServiceSpy: jasmine.SpyObj<SocialMediaApiService>;

  const defaultPosts: SocialMediaPost[] = [
    {
      id: 'post-001',
      avatarUrl: 'https://i.pravatar.cc/80?img=1',
      content: 'post',
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

  const likedPost: SocialMediaPost = {
    ...defaultPosts[0],
    likes: 2,
    likedByMe: true,
  };

  beforeEach(waitForAsync(() => {
    socialMediaApiServiceSpy = SocialMediaApiServiceSpy.create();
    socialMediaApiServiceSpy.getPosts.and.returnValue(of(defaultPosts));
    socialMediaApiServiceSpy.likePost.and.returnValue(of(likedPost));

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), SocialMediaComponent],
      providers: [
        provideTranslateService(),
        { provide: SocialMediaApiService, useValue: socialMediaApiServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialMediaComponent);
    component = fixture.componentInstance;
  }));

  it('should create', () => {
    // ARRANGE

    // ACT
    fixture.detectChanges();

    // ASSERT
    expect(component).toBeTruthy();
  });

  it('should load and render posts from social media api service', async () => {
    // ARRANGE
    const expectedPostCount = 1;

    // ACT
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // ASSERT
    expect(socialMediaApiServiceSpy.getPosts).toHaveBeenCalled();
    const postElements = fixture.nativeElement.querySelectorAll('social-media-post');
    expect(postElements.length).toBe(expectedPostCount);
  });

  it('should show social load error when service fails', async () => {
    // ARRANGE
    socialMediaApiServiceSpy.getPosts.and.returnValue(
      throwError(() => new Error('Failed to load posts')),
    );

    // ACT
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    // ASSERT
    expect(component['errorMessageKey']()).toBe('social.loadError');
    expect(component['loading']()).toBeFalse();
  });

  it('should update local post state after successful like', async () => {
    // ARRANGE
    const expectedLikeCount = 2;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const targetPostId = 'post-001';

    // ACT
    (component as unknown as { likePost: (postId: string) => void }).likePost(targetPostId);
    await fixture.whenStable();
    fixture.detectChanges();
    await new Promise(resolve => setTimeout(resolve, 0));
    fixture.detectChanges();

    // ASSERT
    expect(socialMediaApiServiceSpy.likePost).toHaveBeenCalledWith(targetPostId);
    expect(component['posts']()[0].likes).toBe(expectedLikeCount);
    expect(component['posts']()[0].likedByMe).toBeTrue();
  });

  it('should refresh posts and complete refresher event after the request settles', fakeAsync(() => {
    // ARRANGE
    const expectedGetPostsCallCount = 2;
    const completeSpy = jasmine.createSpy('complete').and.returnValue(Promise.resolve());
    const refreshEvent = {
      target: { complete: completeSpy },
    } as unknown as import('@ionic/core').RefresherCustomEvent;

    fixture.detectChanges();
    tick();
    fixture.detectChanges();

    // ACT
    (
      component as unknown as {
        handleRefresh: (event: import('@ionic/core').RefresherCustomEvent) => void;
      }
    ).handleRefresh(refreshEvent);

    expect(completeSpy).not.toHaveBeenCalled();

    tick();
    fixture.detectChanges();

    // ASSERT
    expect(completeSpy).toHaveBeenCalled();
    expect(socialMediaApiServiceSpy.getPosts).toHaveBeenCalledTimes(expectedGetPostsCallCount);
  }));
});
