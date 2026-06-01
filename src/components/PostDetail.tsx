import React, { useState, useRef } from 'react';
import { Post, UserProfile } from '../types';
import { ChevronLeft, MoreHorizontal, Heart, MessageCircle, Send, Bookmark, Copy, Trash2 } from 'lucide-react';
import { getFilterStyle } from '../filters';

interface PostDetailProps {
  post: Post;
  profile: UserProfile;
  onClose: () => void;
  onDelete: () => void;
}

export function PostDetail({ post, profile, onClose, onDelete }: PostDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Format date simply
  const dateObj = new Date(post.createdAt);
  const formattedDate = dateObj.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const width = e.currentTarget.clientWidth;
    setCurrentImageIndex(Math.round(scrollLeft / width));
  };

  const scrollLeftNav = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  const scrollRightNav = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-xl mx-auto">
       <header className="flex items-center justify-between px-4 pt-[calc(12px+env(safe-area-inset-top,0px))] pb-3 border-b border-gray-100 sticky top-0 bg-white z-10 shrink-0">
        <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-1 -ml-1">
            <ChevronLeft className="w-7 h-7 stroke-[1.5]" />
            </button>
            <h2 className="text-xl font-semibold">Gönderiler</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-32">
         {/* Post Header */}
         <div className="flex items-center justify-between px-4 py-3">
             <div className="flex items-center gap-3">
                 <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 p-[1.5px] bg-gradient-to-tr from-yellow-400 to-fuchsia-600">
                     <img src={profile.profilePic} alt="Profile" className="w-full h-full object-cover rounded-full border border-white" />
                 </div>
                 <span className="font-semibold text-sm">{profile.username}</span>
             </div>
             <button onClick={() => setShowOptions(true)} className="p-1">
                 <MoreHorizontal className="w-5 h-5 text-gray-500" />
             </button>
         </div>

         {/* Image */}
         <div className="w-full bg-gray-100 flex flex-col relative group">
             <div 
               ref={scrollRef}
               className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide relative"
               onScroll={handleScroll}
             >
                 {post.media?.map((m, idx) => (
                    <div key={idx} className="w-full shrink-0 snap-center relative">
                        <img 
                          src={m.imageUrl} 
                          alt="Post" 
                          className={`w-full h-auto max-h-[600px] object-cover ${m.filterClass || ''}`}
                          style={m.customFilters ? getFilterStyle(m.customFilters) : {}}
                        />
                    </div>
                 ))}
             </div>
             
             {/* Navigation Arrows */}
             {post.media?.length > 1 && currentImageIndex > 0 && (
               <button 
                 onClick={scrollLeftNav} 
                 className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 transition p-1.5 rounded-full text-white z-10 shadow-sm"
               >
                 <ChevronLeft className="w-5 h-5 pr-0.5" />
               </button>
             )}
             {post.media?.length > 1 && currentImageIndex < post.media.length - 1 && (
               <button 
                 onClick={scrollRightNav} 
                 className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 transition p-1.5 rounded-full text-white z-10 shadow-sm"
               >
                 <ChevronLeft className="w-5 h-5 rotate-180 pr-0.5" />
               </button>
             )}

             {post.media?.length > 1 && (
               <div className="flex justify-center gap-1.5 py-4 bg-white -mb-8 z-10">
                 {post.media.map((_, i) => (
                   <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentImageIndex ? 'bg-blue-500' : 'bg-gray-300'}`} />
                 ))}
               </div>
             )}
         </div>

         {/* Actions */}
         <div className="px-4 py-3 pb-2 mt-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
                 <Heart className="w-7 h-7 stroke-[1.5] hover:text-gray-500 transition-colors" />
                 <MessageCircle className="w-7 h-7 stroke-[1.5] scale-x-[-1] hover:text-gray-500 transition-colors" />
                 <Send className="w-7 h-7 stroke-[1.5] rotate-12 -mt-1 hover:text-gray-500 transition-colors" />
             </div>
             <Bookmark className="w-7 h-7 stroke-[1.5] hover:text-gray-500 transition-colors" />
         </div>

         {/* Likes & Caption */}
         <div className="px-4 pb-4">
             <p className="font-semibold text-sm mb-1">
                 1.245 beğenme
             </p>
             <p className="text-sm">
                 <span className="font-semibold mr-2">{profile.username}</span>
                 {post.caption}
             </p>
             <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide">
                 {formattedDate}
             </p>
         </div>
      </div>

      {/* Action Sheet overlay */}
      {showOptions && (
        <>
          <div className="absolute inset-0 bg-black/40 z-50 flex flex-col justify-end" onClick={() => setShowOptions(false)}>
            <div className="bg-white rounded-t-2xl w-full flex flex-col pt-2 pb-8 px-4" onClick={e => e.stopPropagation()}>
               <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-6"></div>
               
               <button 
                 onClick={() => {
                   onDelete();
                   setShowOptions(false);
                 }}
                 className="flex items-center gap-3 w-full p-4 text-red-500 font-semibold bg-gray-50 hover:bg-red-50 rounded-xl transition"
               >
                 <Trash2 className="w-6 h-6 stroke-[1.5]" />
                 <span>Sil</span>
               </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
