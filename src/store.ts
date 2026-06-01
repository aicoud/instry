import { useState, useEffect } from 'react';
import { AppState, Post, UserProfile } from './types';

const STORAGE_KEY = 'grid_preview_app_state_v2';

const defaultUserId = 'user_1';

const defaultProfile: UserProfile = {
  id: defaultUserId,
  username: 'kullanici_adin',
  fullName: 'Kullanıcı Adın',
  bio: '',
  profilePic: '/default_avatar.png',
  postsCount: 0,
  followersCount: 0,
  followingCount: 0,
};

const defaultState: AppState = {
  currentUserId: null,
  profiles: {
    [defaultUserId]: defaultProfile
  },
  posts: {
    [defaultUserId]: []
  },
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    try {
      const item = window.localStorage.getItem(STORAGE_KEY);
      if (item) {
        return JSON.parse(item);
      }
      // Migrate old data if exists
      const oldItem = window.localStorage.getItem('grid_preview_app_state');
      if (oldItem) {
        const oldState = JSON.parse(oldItem);
        const newUserId = 'user_migrated';
        return {
          currentUserId: newUserId,
          profiles: {
            [newUserId]: { ...oldState.profile, id: newUserId }
          },
          posts: {
            [newUserId]: oldState.posts || []
          }
        };
      }
      return defaultState;
    } catch (error) {
      console.warn('Error reading localStorage', error);
      return defaultState;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.warn('Error setting localStorage', error);
    }
  }, [state]);

  const login = (username: string) => {
    // Find if user exists
    const existingUserId = (Object.values(state.profiles) as UserProfile[]).find(p => p.username === username)?.id;
    if (existingUserId) {
      setState(prev => ({ ...prev, currentUserId: existingUserId }));
    } else {
      // Create new user
      const newUserId = 'user_' + Math.random().toString(36).substring(2, 9);
      const newProfile: UserProfile = { ...defaultProfile, id: newUserId, username, fullName: username, postsCount: 0 };
      setState(prev => ({
        ...prev,
        currentUserId: newUserId,
        profiles: { ...prev.profiles, [newUserId]: newProfile },
        posts: { ...prev.posts, [newUserId]: [] }
      }));
    }
  };

  const logout = () => {
    setState(prev => ({ ...prev, currentUserId: null }));
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const userId = state.currentUserId;
    if (!userId) return;
    setState((prev) => ({
      ...prev,
      profiles: {
        ...prev.profiles,
        [userId]: { ...prev.profiles[userId], ...updates }
      }
    }));
  };

  const addPost = (post: Omit<Post, 'id' | 'createdAt'>) => {
    const userId = state.currentUserId;
    if (!userId) return;
    
    const newPost: Post = {
      ...post,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
    };
    
    setState((prev) => {
      const userPosts = [newPost, ...(prev.posts[userId] || [])];
      return {
        ...prev,
        posts: { ...prev.posts, [userId]: userPosts },
        profiles: {
          ...prev.profiles,
          [userId]: { ...prev.profiles[userId], postsCount: userPosts.length }
        }
      };
    });
  };

  const deletePost = (postId: string) => {
    const userId = state.currentUserId;
    if (!userId) return;

    setState((prev) => {
      const userPosts = prev.posts[userId].filter((p) => p.id !== postId);
      return {
        ...prev,
        posts: { ...prev.posts, [userId]: userPosts },
        profiles: {
          ...prev.profiles,
          [userId]: { ...prev.profiles[userId], postsCount: userPosts.length }
        }
      };
    });
  };

  const reorderPosts = (reorderedList: Post[]) => {
    const userId = state.currentUserId;
    if (!userId) return;

    setState((prev) => ({
      ...prev,
      posts: {
        ...prev.posts,
        [userId]: reorderedList
      }
    }));
  };

  const importInstagramFeed = (profileUpdates: Partial<UserProfile>, newPosts: Post[]) => {
    const userId = state.currentUserId;
    if (!userId) return;

    setState((prev) => {
      const mergedProfile = { ...prev.profiles[userId], ...profileUpdates };
      return {
        ...prev,
        profiles: {
          ...prev.profiles,
          [userId]: mergedProfile
        },
        posts: {
          ...prev.posts,
          [userId]: newPosts
        }
      };
    });
  };

  const deleteAccount = () => {
    const userId = state.currentUserId;
    if (!userId) return;

    setState((prev) => {
      const newProfiles = { ...prev.profiles };
      delete newProfiles[userId];
      const newPosts = { ...prev.posts };
      delete newPosts[userId];
      
      return {
        ...prev,
        currentUserId: null,
        profiles: newProfiles,
        posts: newPosts
      };
    });
  };

  const getCurrentUser = () => state.currentUserId ? state.profiles[state.currentUserId] : null;
  const getCurrentPosts = () => state.currentUserId ? (state.posts[state.currentUserId] || []) : [];

  return { 
    state, 
    login, 
    logout, 
    updateProfile, 
    addPost, 
    deletePost,
    reorderPosts,
    importInstagramFeed,
    deleteAccount,
    currentUser: getCurrentUser(),
    currentPosts: getCurrentPosts()
  };
}
