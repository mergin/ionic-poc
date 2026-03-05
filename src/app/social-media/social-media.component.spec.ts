import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { of } from 'rxjs';

import { SocialMediaComponent } from '@app/social-media/social-media.component';
import { SocialMediaApiService } from '@app/social-media/services';
import { SocialMediaApiServiceSpy } from '@app/social-media/services/social-media-api/social-media-api.service.spy';

describe('SocialMediaComponent', () => {
  let component: SocialMediaComponent;
  let fixture: ComponentFixture<SocialMediaComponent>;
  let socialMediaApiServiceSpy: jasmine.SpyObj<SocialMediaApiService>;

  beforeEach(waitForAsync(() => {
    socialMediaApiServiceSpy = SocialMediaApiServiceSpy.create();
    socialMediaApiServiceSpy.getPosts.and.returnValue(of([]));
    socialMediaApiServiceSpy.likePost.and.returnValue(
      of({
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
        likedByMe: true,
        replies: 0,
        reposts: 0,
      }),
    );

    TestBed.configureTestingModule({
      imports: [IonicModule.forRoot(), SocialMediaComponent],
      providers: [{ provide: SocialMediaApiService, useValue: socialMediaApiServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(SocialMediaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    // ARRANGE

    // ACT

    // ASSERT
    expect(component).toBeTruthy();
  });
});
