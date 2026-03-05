import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { SocialMediaApiService } from '@app/social-media/services/social-media-api/social-media-api.service';

describe('SocialMediaApiService', () => {
  let service: SocialMediaApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(SocialMediaApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch posts', () => {
    // ARRANGE
    const responseMock = [
      {
        id: 'post-001',
        avatarUrl: 'https://i.pravatar.cc/80?img=1',
        content: 'post content',
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

    // ACT
    service.getPosts().subscribe(posts => {
      // ASSERT
      expect(posts).toEqual(responseMock);
    });

    const req = httpMock.expectOne('https://api-gateway.example.com/v1/social/posts');
    expect(req.request.method).toBe('GET');
    req.flush(responseMock);
  });

  it('should fetch a post by id', () => {
    // ARRANGE
    const postId = 'post-001';
    const responseMock = {
      id: postId,
      avatarUrl: 'https://i.pravatar.cc/80?img=1',
      content: 'post content',
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

    // ACT
    service.getPostById(postId).subscribe(post => {
      // ASSERT
      expect(post).toEqual(responseMock);
    });

    const req = httpMock.expectOne(`https://api-gateway.example.com/v1/social/posts/${postId}`);
    expect(req.request.method).toBe('GET');
    req.flush(responseMock);
  });

  it('should like a post', () => {
    // ARRANGE
    const postId = 'post-001';
    const responseMock = {
      id: postId,
      avatarUrl: 'https://i.pravatar.cc/80?img=1',
      content: 'post content',
      author: {
        id: 'user-001',
        handle: 'davidp',
        displayName: 'David Prieto',
        avatarUrl: 'https://i.pravatar.cc/80?img=1',
      },
      timestamp: '2026-03-05T00:00:00.000Z',
      likes: 2,
      likedByMe: true,
      replies: 0,
      reposts: 0,
    };

    // ACT
    service.likePost(postId).subscribe(post => {
      // ASSERT
      expect(post).toEqual(responseMock);
    });

    const req = httpMock.expectOne(
      `https://api-gateway.example.com/v1/social/posts/${postId}/likes`,
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({});
    req.flush(responseMock);
  });
});
