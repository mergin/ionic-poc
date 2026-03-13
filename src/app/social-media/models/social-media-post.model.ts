/** Author profile details shown for a social media post. */
export interface SocialPostAuthor {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
}

/** Post entity displayed in the social media feed. */
export interface SocialMediaPost {
  id: string;
  avatarUrl: string;
  content: string;
  author: SocialPostAuthor;
  timestamp: string;
  likes: number;
  likedByMe: boolean;
  replies: number;
  reposts: number;
}
