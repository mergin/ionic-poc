import { delay, http, HttpResponse } from 'msw';
import { socialPostsDb, type MockSocialPost } from '@mocks/db';

const BASE = 'https://api-gateway.example.com/v1';

function randomizeEngagement(post: MockSocialPost): MockSocialPost {
  const likesBoost = Math.floor(Math.random() * 7);
  const repliesBoost = Math.floor(Math.random() * 3);
  const repostsBoost = Math.floor(Math.random() * 2);

  return {
    ...post,
    likes: post.likes + likesBoost,
    replies: post.replies + repliesBoost,
    reposts: post.reposts + repostsBoost,
  };
}

export const socialMediaHandlers = [
  http.get(`${BASE}/social/posts`, async () => {
    await delay(300);

    const posts = [...socialPostsDb]
      .sort(
        (leftPost, rightPost) =>
          new Date(rightPost.timestamp).getTime() - new Date(leftPost.timestamp).getTime(),
      )
      .map(randomizeEngagement);

    return HttpResponse.json(posts);
  }),

  http.get(`${BASE}/social/posts/:id`, async ({ params }) => {
    await delay(200);

    const post = socialPostsDb.find(({ id }) => id === params['id']);
    if (!post) {
      return HttpResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return HttpResponse.json(post);
  }),

  http.post(`${BASE}/social/posts/:id/likes`, async ({ params }) => {
    await delay(150);

    const post = socialPostsDb.find(({ id }) => id === params['id']);
    if (!post) {
      return HttpResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    post.likedByMe = true;
    post.likes += 1;

    return HttpResponse.json(post);
  }),
];
