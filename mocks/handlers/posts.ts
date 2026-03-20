import { delay, http, HttpResponse } from 'msw';
import { socialPostsDb, type MockSocialPost } from '@mocks/db';
import { generateMockSocialPosts } from '@mocks/generate-mock-social-posts';

const BASE = 'https://api-gateway.example.com/v1';

const DELAY = {
  short: 150,
  medium: 200,
  long: 300,
} as const;

/**
 * Randomizes the engagement metrics of a social media post.
 * @param post The social media post to randomize.
 * @returns The social media post with randomized engagement metrics.
 */
function randomizeEngagement(post: MockSocialPost): MockSocialPost {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const likesBoost = Math.floor(Math.random() * 7);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  const repliesBoost = Math.floor(Math.random() * 3);
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
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
    await delay(DELAY.long);

    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    const morePosts = generateMockSocialPosts(75, 26);

    const posts = [...socialPostsDb, ...morePosts]
      .sort(
        (leftPost, rightPost) =>
          new Date(rightPost.timestamp).getTime() - new Date(leftPost.timestamp).getTime(),
      )
      .map(randomizeEngagement);

    return HttpResponse.json(posts);
  }),

  http.get(`${BASE}/social/posts/:id`, async ({ params }) => {
    await delay(DELAY.medium);

    const post = socialPostsDb.find(({ id }) => id === params['id']);
    if (!post) {
      return HttpResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    return HttpResponse.json(post);
  }),

  http.post(`${BASE}/social/posts/:id/likes`, async ({ params }) => {
    await delay(DELAY.short);

    const post = socialPostsDb.find(({ id }) => id === params['id']);
    if (!post) {
      return HttpResponse.json({ message: 'Post not found' }, { status: 404 });
    }

    post.likedByMe = true;
    post.likes += 1;

    return HttpResponse.json(post);
  }),
];
