import React, { useState, useRef } from 'react';
import { UserProfile } from '../types';
import { ChevronLeft, Info } from 'lucide-react';

interface EditProfileModalProps {
  profile: UserProfile;
  onClose: () => void;
  onSave: (updates: Partial<UserProfile>) => void;
}

export function EditProfileModal({ profile, onClose, onSave }: EditProfileModalProps) {
  const [username, setUsername] = useState(profile.username);
  const [fullName, setFullName] = useState(profile.fullName);
  const [bio, setBio] = useState(profile.bio);
  const [profilePic, setProfilePic] = useState(profile.profilePic);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePic(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave({ username, fullName, bio, profilePic });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-xl mx-auto">
      <header className="flex items-center justify-between px-4 pt-[calc(12px+env(safe-area-inset-top,0px))] pb-3 border-b border-gray-100 sticky top-0 bg-white z-10 shrink-0">
        <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-1 -ml-1">
               <ChevronLeft className="w-7 h-7 stroke-[1.5]" />
            </button>
            <h2 className="text-xl font-semibold">Profili Düzenle</h2>
        </div>
        <button onClick={handleSave} className="text-blue-500 font-semibold text-lg">
            Bitti
        </button>
      </header>
      
      <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="flex flex-col items-center mb-8">
             <div className="w-24 h-24 rounded-full overflow-hidden mb-4 bg-gray-100">
                <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
             </div>
             <button onClick={() => fileInputRef.current?.click()} className="text-blue-500 font-semibold text-sm">
                Resmi veya avatarı düzenle
             </button>
             <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePicChange} />
          </div>

          <div className="space-y-4">
              <div className="flex flex-col gap-1">
                 <label className="text-xs text-gray-500 font-semibold uppercase">Adı</label>
                 <input 
                   type="text" 
                   value={fullName}
                   onChange={(e) => setFullName(e.target.value)}
                   className="border-b border-gray-200 py-2 outline-none text-sm focus:border-gray-400 transition"
                 />
              </div>
              <div className="flex flex-col gap-1">
                 <label className="text-xs text-gray-500 font-semibold uppercase">Kullanıcı Adı</label>
                 <input 
                   type="text" 
                   value={username}
                   onChange={(e) => setUsername(e.target.value)}
                   className="border-b border-gray-200 py-2 outline-none text-sm focus:border-gray-400 transition"
                 />
              </div>
              <div className="flex flex-col gap-1">
                 <label className="text-xs text-gray-500 font-semibold uppercase">Biyografi</label>
                 <textarea 
                   value={bio}
                   onChange={(e) => setBio(e.target.value)}
                   className="border-b border-gray-200 py-2 outline-none text-sm resize-none h-20 focus:border-gray-400 transition"
                 />
              </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-100">
             <div className="flex items-start gap-3 bg-gray-50 p-4 rounded-xl text-sm text-gray-600">
                 <Info className="w-5 h-5 shrink-0 text-gray-400" />
                 <p>Bu uygulama sosyal bir ağ değildir. Sadece kendi profilinizin estetiğini görmek ve test etmek için bir araçtır. Verileriniz tarayıcınızda (lokal) saklanır.</p>
             </div>
          </div>
      </div>
    </div>
  );
}
