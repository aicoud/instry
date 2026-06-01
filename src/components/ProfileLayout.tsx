import React, { useState } from 'react';
import { UserProfile, Post } from '../types';
import { Settings, PlusSquare, Menu, Grid3X3, PlaySquare, UserSquare2, ChevronLeft, Copy, Move, Globe } from 'lucide-react';
import { getFilterStyle } from '../filters';

interface ProfileLayoutProps {
  profile: UserProfile;
  posts: Post[];
  onEditProfileClick: () => void;
  onPostClick: (post: Post) => void;
  onSettingsClick: () => void;
  onReorderPosts: (posts: Post[]) => void;
  onInstagramImportClick: () => void;
}

export function ProfileLayout({ profile, posts, onEditProfileClick, onPostClick, onSettingsClick, onReorderPosts, onInstagramImportClick }: ProfileLayoutProps) {
  const [activeTab, setActiveTab] = useState<'grid' | 'reels' | 'tagged'>('grid');
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPostIdForSwap, setSelectedPostIdForSwap] = useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handlePostClick = (post: Post) => {
    if (isEditMode) {
      if (selectedPostIdForSwap === null) {
        setSelectedPostIdForSwap(post.id);
      } else {
        if (selectedPostIdForSwap !== post.id) {
          const index1 = posts.findIndex(p => p.id === selectedPostIdForSwap);
          const index2 = posts.findIndex(p => p.id === post.id);
          if (index1 !== -1 && index2 !== -1) {
            const reordered = [...posts];
            reordered[index1] = posts[index2];
            reordered[index2] = posts[index1];
            onReorderPosts(reordered);
          }
        }
        setSelectedPostIdForSwap(null);
      }
    } else {
      onPostClick(post);
    }
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    if (!isEditMode) return;
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!isEditMode || draggedIndex === null) return;
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    if (!isEditMode || draggedIndex === null) return;
    e.preventDefault();
    if (draggedIndex === index) return;

    const reordered = [...posts];
    const [draggedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(index, 0, draggedItem);
    
    onReorderPosts(reordered);
    setDraggedIndex(null);
  };

  return (
    <div className="w-full bg-white min-h-screen pb-16">
      {/* Top Header */}
      <header className="flex items-center justify-between px-4 pt-[calc(12px+env(safe-area-inset-top,0px))] pb-3 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight">{profile.username}</h1>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => alert('Profil ve fotoğraf düzeniniz başarıyla kaydedildi! 💾')}
            className="text-xs font-extrabold text-blue-500 hover:text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-50/50 border border-blue-100 transition duration-200 cursor-pointer shadow-sm shadow-blue-500/5 active:scale-[0.98]"
          >
            Kaydet
          </button>
          <button onClick={onSettingsClick} className="p-1 -mr-1">
            <Menu className="w-7 h-7 stroke-[1.5]" />
          </button>
        </div>
      </header>

      {/* Profile Info */}
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-4">
          <div className="relative pr-4">
            <div className="w-20 h-20 rounded-full p-[2.5px] bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600">
              <img
                src={profile.profilePic || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-2 border-white"
              />
            </div>
            <div className="absolute bottom-1 right-3 bg-blue-500 rounded-full border-[2.5px] border-white w-6 h-6 flex items-center justify-center">
              <PlusSquare className="w-3.5 h-3.5 text-white stroke-[3]" />
            </div>
          </div>

          <div className="flex flex-1 justify-around text-center items-center">
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg leading-tight">{profile.postsCount}</span>
              <span className="text-[13px] text-gray-800 tracking-tight">Gönderiler</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg leading-tight">{profile.followersCount}</span>
              <span className="text-[13px] text-gray-800 tracking-tight">Takipçi</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg leading-tight">{profile.followingCount}</span>
              <span className="text-[13px] text-gray-800 tracking-tight">Takip</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h2 className="font-semibold text-[14px]">{profile.fullName}</h2>
          <p className="text-[14px] whitespace-pre-wrap mt-0.5 leading-snug">{profile.bio}</p>
        </div>

        {/* Instagram'dan Aktar Banner - Hidden in live UI but remains in code as requested */}
        {false && (
          <button
            onClick={onInstagramImportClick}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 text-white font-bold text-xs shadow-sm hover:opacity-95 active:scale-[0.99] transition mb-4 cursor-pointer text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Globe className="w-5 h-5 animate-pulse shrink-0" />
              <div className="flex flex-col items-start leading-tight min-w-0">
                <span className="font-bold truncate w-full">Instagram Profilini Bağla</span>
                <span className="text-[9.5px] opacity-90 font-medium truncate w-full">Biyografi ve gerçek fotoğrafları saniyeler içinde çek</span>
              </div>
            </div>
            <span className="bg-white/20 px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider shrink-0">Aktar</span>
          </button>
        )}

        <div className="flex flex-col gap-2 mb-6">
          <div className="flex gap-2">
            <button
              onClick={onEditProfileClick}
              className="flex-1 bg-gray-100 hover:bg-gray-200 transition text-black font-semibold text-sm py-1.5 rounded-lg"
            >
              Profili Düzenle
            </button>
            <button
              onClick={() => {
                setIsEditMode(!isEditMode);
                setSelectedPostIdForSwap(null);
              }}
              className={`flex-1 flex items-center justify-center gap-1.5 transition font-semibold text-sm py-1.5 rounded-lg border ${
                isEditMode
                  ? 'bg-blue-500 border-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 border-transparent text-black'
              }`}
            >
              <Settings className={`w-4 h-4 ${isEditMode ? 'animate-spin' : ''}`} />
              {isEditMode ? 'Yerleşimi Bitir' : 'Yerleşimi Düzenle'}
            </button>
            <button className="bg-gray-100 py-1.5 px-3 rounded-lg flex items-center justify-center hover:bg-gray-200 transition">
              <UserSquare2 className="w-5 h-5 stroke-[2]" />
            </button>
          </div>

          {isEditMode && (
            <div className="bg-blue-50 text-blue-700 text-xs rounded-lg p-3 border border-blue-100 flex flex-col gap-1 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                </span>
                <span className="font-semibold">Düzenleme Modu Aktif!</span>
              </div>
              <p className="text-[11px] leading-relaxed text-blue-600">
                {selectedPostIdForSwap 
                  ? 'Konumunu değiştirmek için ikinci bir fotoğrafa dokunun.' 
                  : 'Bilgisayarda fotoğrafları sürükleyerek yerleştirebilir, telefonda ise sırayla iki fotoğrafa dokunarak yerlerini değiştirebilirsiniz.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-t border-gray-200">
        <button
          onClick={() => setActiveTab('grid')}
          className={`flex-1 py-3 flex items-center justify-center border-b-2 transition-colors ${
            activeTab === 'grid' ? 'border-black text-black' : 'border-transparent text-gray-400'
          }`}
        >
          <Grid3X3 className="w-6 h-6 stroke-[1.5]" />
        </button>
        <button
          onClick={() => setActiveTab('reels')}
          className={`flex-1 py-3 flex items-center justify-center border-b-2 transition-colors ${
            activeTab === 'reels' ? 'border-black text-black' : 'border-transparent text-gray-400'
          }`}
        >
          <PlaySquare className="w-6 h-6 stroke-[1.5]" />
        </button>
        <button
          onClick={() => setActiveTab('tagged')}
          className={`flex-1 py-3 flex items-center justify-center border-b-2 transition-colors ${
            activeTab === 'tagged' ? 'border-black text-black' : 'border-transparent text-gray-400'
          }`}
        >
          <UserSquare2 className="w-6 h-6 stroke-[1.5]" />
        </button>
      </div>

      {/* Grid */}
      {activeTab === 'grid' && (
        <>
          {posts.length > 0 ? (
            <div className="columns-3 gap-0.5 p-0.5">
              {posts.map((post, index) => {
                const firstMedia = post.media?.[0];
                if (!firstMedia) return null;
                const isSelectedForSwap = selectedPostIdForSwap === post.id;
                
                return (
                  <div
                    key={post.id}
                    className={`break-inside-avoid mb-0.5 cursor-pointer relative overflow-hidden bg-gray-100 group transition-all duration-200 ${
                      isEditMode ? 'hover:scale-[0.98] ring-offset-1 select-none' : ''
                    } ${isSelectedForSwap ? 'ring-4 ring-blue-500 scale-[0.96] opacity-90 z-10' : ''}`}
                    onClick={() => handlePostClick(post)}
                    draggable={isEditMode}
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <img
                      src={firstMedia.imageUrl}
                      alt={post.caption || 'Post image'}
                      className={`w-full h-auto block transition-all ${
                        isEditMode ? 'opacity-90 grayscale-[20%]' : 'group-active:opacity-80'
                      } ${firstMedia.filterClass || ''}`}
                      style={firstMedia.customFilters ? getFilterStyle(firstMedia.customFilters) : {}}
                    />
                    
                    {/* Visual markers during Edit Mode */}
                    {isEditMode && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white/95 rounded-full p-1.5 shadow-md">
                          <Move className="w-4 h-4 text-gray-700" />
                        </div>
                      </div>
                    )}

                    {post.media.length > 1 && !isEditMode && (
                      <Copy className="absolute top-2 right-2 w-4 h-4 text-white drop-shadow-md scale-x-[-1]" />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-gray-400">
              <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4">
                <Grid3X3 className="w-12 h-12 stroke-[1]" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Henüz Gönderi Yok</h3>
              <p className="text-sm font-medium">Önizlemek için ilk fotoğrafını ekle.</p>
            </div>
          )}
        </>
      )}

      {activeTab !== 'grid' && (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400 px-8 text-center">
          <p className="text-sm">Sadece Grid (Profil) önizlemesi destekleniyor. Burası Reels veya Etiketlenenler sekmesi olabilir.</p>
        </div>
      )}
    </div>
  );
}

