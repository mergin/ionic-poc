export interface SocialPostAuthor {
  id: string;
  handle: string;
  displayName: string;
  avatarUrl: string;
}

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
