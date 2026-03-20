/* eslint-disable @typescript-eslint/no-magic-numbers */
import { faker } from '@faker-js/faker';

import type { MockSocialPost } from './db';

/**
 * Generates a single mock social post using faker.
 * @param id The post id (e.g., 'post-026')
 * @returns A MockSocialPost object
 */
export function generateMockSocialPost(id: string): MockSocialPost {
  const authorId = faker.string.uuid();
  const authorName = faker.person.fullName();
  const handle = faker.internet
    .username({ firstName: authorName.split(' ')[0], lastName: authorName.split(' ')[1] || '' })
    .toLowerCase();
  const avatarSeed = encodeURIComponent(authorName);
  const avatarUrl = `https://api.dicebear.com/9.x/adventurer-neutral/svg?seed=${avatarSeed}`;
  return {
    id,
    avatarUrl,
    content: faker.lorem.sentence({ min: 6, max: 16 }),
    author: {
      id: authorId,
      handle,
      displayName: authorName,
      avatarUrl,
    },
    timestamp: faker.date
      .between({ from: '2026-02-01T08:00:00.000Z', to: '2026-02-28T23:59:59.999Z' })
      .toISOString(),
    likes: faker.number.int({ min: 10, max: 600 }),
    likedByMe: faker.datatype.boolean(),
    replies: faker.number.int({ min: 0, max: 50 }),
    reposts: faker.number.int({ min: 0, max: 40 }),
  };
}

/**
 * Generates an array of mock social posts.
 * @param count Number of posts to generate
 * @param startIndex Starting index for post ids (e.g., 26 for 'post-026')
 * @returns Array of MockSocialPost
 */
export function generateMockSocialPosts(count: number, startIndex = 26): MockSocialPost[] {
  return Array.from({ length: count }, (_, i) => {
    const id = `post-${String(startIndex + i).padStart(3, '0')}`;
    return generateMockSocialPost(id);
  });
}
