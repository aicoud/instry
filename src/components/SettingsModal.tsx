import React from 'react';
import { ChevronLeft, LogOut, Trash2, Plus } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  profiles: UserProfile[];
  currentUserId: string;
  onSwitchAccount: (userId: string) => void;
}

export function SettingsModal({ onClose, onLogout, onDeleteAccount, profiles, currentUserId, onSwitchAccount }: SettingsModalProps) {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-xl mx-auto">
      <header className="flex items-center justify-between px-4 pt-[calc(12px+env(safe-area-inset-top,0px))] pb-3 border-b border-gray-100 sticky top-0 bg-white z-10 shrink-0">
        <div className="flex items-center gap-4">
            <button onClick={onClose} className="p-1 -ml-1">
               <ChevronLeft className="w-7 h-7 stroke-[1.5]" />
            </button>
            <h2 className="text-xl font-semibold">Ayarlar ve hareketler</h2>
        </div>
      </header>
      
      <div className="flex-1 overflow-y-auto w-full">
         <div className="p-4">
             <div className="bg-gray-50 rounded-xl p-4 flex flex-col gap-1 border border-gray-100 mb-6 mt-2">
                 <h3 className="font-semibold text-sm">Hesap Merkezi</h3>
                 <p className="text-xs text-gray-500">Tüm hesaplarınızı buradan yönetebilir, hesaplar arası geçiş yapabilir veya mevcut hesabınızı silebilirsiniz.</p>
             </div>
             
             <div className="flex flex-col mb-8">
                <h4 className="text-xs font-semibold text-gray-400 border-b border-gray-100 pb-2 mb-2 uppercase tracking-wider ml-1">Kayıtlı Hesaplar</h4>
                <div className="flex flex-col gap-1">
                   {profiles.map(p => (
                     <button
                       key={p.id}
                       onClick={() => onSwitchAccount(p.id)}
                       className={`flex items-center gap-3 p-3 rounded-xl transition ${p.id === currentUserId ? 'bg-blue-50 border border-blue-100' : 'hover:bg-gray-50 border border-transparent'}`}
                     >
                       <img src={p.profilePic} alt={p.username} className="w-12 h-12 rounded-full object-cover bg-gray-100" />
                       <div className="flex flex-col items-start flex-1">
                         <span className="text-sm font-semibold">{p.username}</span>
                         <span className="text-xs text-gray-500">{p.fullName}</span>
                       </div>
                       {p.id === currentUserId && <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>}
                     </button>
                   ))}
                   <button onClick={onLogout} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition text-blue-500 font-semibold mt-1">
                     <div className="w-12 h-12 rounded-full flex items-center justify-center border border-blue-500 border-dashed bg-blue-50">
                       <Plus className="w-6 h-6" />
                     </div>
                     <span className="text-sm">Yeni Hesap Ekle</span>
                   </button>
                </div>
             </div>

             <div className="flex flex-col pt-4">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">Oturum</h4>
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center justify-between p-4 text-gray-700 font-semibold hover:bg-gray-50 rounded-xl transition"
                >
                    Çıkış Yap
                    <LogOut className="w-5 h-5 text-gray-400" />
                </button>
                <button 
                  onClick={onDeleteAccount}
                  className="w-full flex items-center justify-between p-4 text-red-500 font-semibold hover:bg-red-50 rounded-xl transition mt-2 cursor-pointer"
                >
                    Hesabı Sil
                    <Trash2 className="w-5 h-5 text-red-500" />
                </button>
             </div>
         </div>
      </div>
    </div>
  );
}
