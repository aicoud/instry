export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  bio: string;
  profilePic: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface CustomFilters {
  brightness: number;
  contrast: number;
  saturation: number;
  sepia: number;
  grayscale: number;
}

export interface PostMedia {
  imageUrl: string;
  filterClass: string;
  customFilters: CustomFilters;
  aspectRatio?: 'square' | 'portrait' | 'landscape'; // Canvas aspect ratios
}

export interface Post {
  id: string;
  media: PostMedia[];
  caption: string;
  createdAt: number;
}

export interface AppState {
  currentUserId: string | null;
  profiles: Record<string, UserProfile>;
  posts: Record<string, Post[]>;
}

