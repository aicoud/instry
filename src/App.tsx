import React, { useState } from 'react';
import { useAppState } from './store';
import { ProfileLayout } from './components/ProfileLayout';
import { BottomNavigation } from './components/BottomNavigation';
import { PhotoEditorModal } from './components/PhotoEditorModal';
import { PostDetail } from './components/PostDetail';
import { EditProfileModal } from './components/EditProfileModal';
import { AuthScreen } from './components/AuthScreen';
import { SettingsModal } from './components/SettingsModal';
import { InstagramImportModal } from './components/InstagramImportModal';
import { Post, UserProfile } from './types';

export default function App() {
  const { state, login, logout, updateProfile, addPost, deletePost, reorderPosts, importInstagramFeed, deleteAccount, currentUser, currentPosts } = useAppState();
  
  const [showEditor, setShowEditor] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showInstagramImport, setShowInstagramImport] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  if (!currentUser) {
    const profilesList = (Object.values(state.profiles) as UserProfile[]).map(p => ({ username: p.username, profilePic: p.profilePic }));
    return <AuthScreen onLogin={login} savedProfiles={profilesList} />;
  }

  // Instagram app aesthetics: max-width container, centered on desktop, full width on mobile
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center text-black selection:bg-gray-200">
      <div className="w-full max-w-xl bg-white min-h-screen relative shadow-sm overflow-hidden flex flex-col">
        
        <ProfileLayout 
          profile={currentUser} 
          posts={currentPosts} 
          onEditProfileClick={() => setShowEditProfile(true)}
          onPostClick={(post) => setSelectedPost(post)}
          onSettingsClick={() => setShowSettings(true)}
          onReorderPosts={reorderPosts}
          onInstagramImportClick={() => setShowInstagramImport(true)}
        />

        <BottomNavigation onAddClick={() => setShowEditor(true)} />

        {showEditor && (
          <PhotoEditorModal 
            onClose={() => setShowEditor(false)} 
            onSave={(photoData) => {
              addPost(photoData);
              setShowEditor(false);
            }} 
          />
        )}

        {showEditProfile && (
          <EditProfileModal 
            profile={currentUser}
            onClose={() => setShowEditProfile(false)}
            onSave={updateProfile}
          />
        )}

        {showSettings && (
          <SettingsModal 
            onClose={() => setShowSettings(false)}
            onLogout={() => {
               logout();
               setShowSettings(false);
            }}
            onDeleteAccount={() => {
               if (window.confirm('Mevcut hesabı ve tüm verilerini silmek istediğinize emin misiniz?')) {
                 deleteAccount();
                 setShowSettings(false);
               }
            }}
            profiles={Object.values(state.profiles)}
            currentUserId={currentUser.id}
            onSwitchAccount={(userId) => {
               const p = state.profiles[userId];
               if (p) {
                   login(p.username);
                   setShowSettings(false);
               }
            }}
          />
        )}

        {selectedPost && (
          <PostDetail 
            post={selectedPost}
            profile={currentUser}
            onClose={() => setSelectedPost(null)}
            onDelete={() => {
              deletePost(selectedPost.id);
              setSelectedPost(null);
            }}
          />
        )}

        {showInstagramImport && (
          <InstagramImportModal
            onClose={() => setShowInstagramImport(false)}
            onImport={(profileUpdates, newPosts) => {
              importInstagramFeed(profileUpdates, newPosts);
              setShowInstagramImport(false);
            }}
            currentUsername={currentUser.username}
          />
        )}
      </div>
    </div>
  );
}

