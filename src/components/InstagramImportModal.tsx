import React, { useState } from 'react';
import { ChevronLeft, Info, RefreshCw, AlertCircle, ArrowRight, Instagram } from 'lucide-react';
import { Post, UserProfile, CustomFilters } from '../types';

interface InstagramImportModalProps {
  onClose: () => void;
  onImport: (profileUpdates: Partial<UserProfile>, newPosts: Post[]) => void;
  currentUsername: string;
}

const DEFAULT_FILTERS: CustomFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  sepia: 0,
  grayscale: 0,
};

export function InstagramImportModal({ onClose, onImport, currentUsername }: InstagramImportModalProps) {
  const [usernameInput, setUsernameInput] = useState(currentUsername || '');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncLogs, setSyncLogs] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [errorText, setErrorText] = useState<string | null>(null);

  const addLog = (log: string) => {
    setSyncLogs(prev => [...prev, `[${new Date().toLocaleTimeString('tr-TR')}] ${log}`]);
  };

  const handleStartImport = async () => {
    const rawUsername = usernameInput.trim().replace(/[^a-zA-Z0-9_.]/g, '');
    if (!rawUsername) {
      setErrorText('Lütfen geçerli bir Instagram kullanıcı adı girin.');
      return;
    }

    setIsSyncing(true);
    setErrorText(null);
    setProgress(5);
    setSyncLogs([]);
    setStatusMessage('Instagram sunucularıyla güvenli bağlantı tüneli kuruluyor...');
    addLog(`Arama indeksi başlatıldı: @${rawUsername}`);

    try {
      const responsePromise = fetch('/api/instagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: rawUsername }),
      });

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev < 40) {
            setStatusMessage('Instagram web verileri ve paylaşımları taranıyor...');
            return prev + 3;
          } else if (prev < 75) {
            setStatusMessage('Biyografi ve profil bilgileri çözümleniyor...');
            return prev + 1.5;
          } else if (prev < 90) {
            setStatusMessage('Gönderi görselleri ve galeri hiyerarşisi oluşturuluyor...');
            return prev + 0.5;
          }
          return prev;
        });
      }, 150);

      const res = await responsePromise;
      clearInterval(progressInterval);

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Instagram profili bulunamadı veya bağlantı hatası oluştu.');
      }

      const data = await res.json();

      // Check if it's private or not found according to the user request
      if (data.isPrivate || data.private) {
        throw new Error('Bu hesap gizlidir. Sadece herkese açık (Public) hesapların gönderilerini içe aktarabilirsiniz.');
      }

      if (!data.posts || data.posts.length === 0) {
        throw new Error('Bu hesaba ait herhangi bir herkese açık gönderi bulunamadı veya hesap taranamadı.');
      }

      setProgress(95);
      setStatusMessage('Veri senkronizasyonu başarılı! Profil aktarılıyor...');

      if (data.logs && Array.isArray(data.logs)) {
        data.logs.forEach((log: string) => addLog(log));
      }

      addLog(`Profil Adı: ${data.fullName || rawUsername}`);
      addLog(`Biyografi: "${data.bio || 'Mevcut değil'}"`);
      addLog(`Takipçi: ${data.followersCount || 0} | Takip Edilen: ${data.followingCount || 0}`);
      addLog(`${data.posts.length} adet gönderi görseli başarıyla içeri aktarıldı.`);

      await new Promise(r => setTimeout(r, 800));
      setProgress(100);

      const importedPosts: Post[] = data.posts.map((p: any, i: number) => ({
        id: `imported_real_${Date.now()}_${i}`,
        caption: p.caption || `Gönderi #${i + 1} #${rawUsername}`,
        createdAt: Date.now() - (i * 3600000 * 5),
        media: [{
          imageUrl: p.url || 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
          filterClass: '',
          customFilters: { ...DEFAULT_FILTERS }
        }]
      }));

      onImport({
        username: rawUsername,
        fullName: data.fullName || rawUsername,
        bio: data.bio || '',
        profilePic: data.profilePic || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=300&q=80',
        followersCount: data.followersCount || 0,
        followingCount: data.followingCount || 0,
        postsCount: importedPosts.length,
      }, importedPosts);

      setIsSyncing(false);
      onClose();
    } catch (e: any) {
      console.error(e);
      setErrorText(e.message || 'Instagram profil verileri çekilemedi. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
      setIsSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-xl mx-auto overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-[calc(14px+env(safe-area-inset-top,0px))] pb-3 border-b border-gray-100 sticky top-0 bg-white z-10 shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-1 -ml-1">
            <ChevronLeft className="w-7 h-7 stroke-[1.5]" />
          </button>
          <h2 className="text-xl font-bold">Instagram'dan Profil Çek</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col justify-between pb-24">
        <div className="flex flex-col gap-6">
          {/* Main Visual Header */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="inline-flex p-4 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 text-white shadow-md">
              <Instagram className="w-10 h-10 stroke-[1.5]" />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-gray-900">Doğrudan Instagram Feed'ini Aktar</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                Herkese açık (Public) Instagram kullanıcı adınızı yazarak profil detaylarınızı, takipçilerinizi ve paylaştığınız gönderileri eksiksiz bir şekilde planlama panelinize senkronize edin.
              </p>
            </div>
          </div>

          {/* Simple Direct Input Field */}
          {!isSyncing && (
            <div className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Instagram Kullanıcı Adı</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400 text-sm">@</span>
                  <input
                    type="text"
                    value={usernameInput}
                    onChange={(e) => setUsernameInput(e.target.value.toLowerCase().trim())}
                    className="w-full bg-gray-50 focus:bg-white border-2 border-gray-100 focus:border-red-400 rounded-xl pl-9 pr-4 py-3.5 text-sm outline-none font-bold transition-all duration-200"
                    placeholder="kullanici_adiniz"
                  />
                </div>
              </div>

              {errorText && (
                <div className="bg-red-50 text-red-600 text-xs rounded-xl p-3 border border-red-100 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorText}</span>
                </div>
              )}

              <button
                onClick={handleStartImport}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-500 via-red-500 to-fuchsia-600 hover:opacity-95 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-500/10 active:scale-[0.99] transition mt-2 cursor-pointer"
              >
                Profil ve Gönderileri Çek
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Sync Status Loading Interface */}
          {isSyncing && (
            <div className="flex flex-col gap-4 bg-slate-50 border border-slate-100 rounded-2xl p-5 mt-2 animate-fade-in">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-5 h-5 text-fuchsia-600 animate-spin shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">İşlem Durumu</span>
                    <span className="text-xs font-bold text-fuchsia-600">%{Math.round(progress)}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 via-red-500 to-fuchsia-600 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-slate-200/50 min-h-[48px] flex items-center gap-2.5">
                <span className="flex h-2 w-2 relative shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-600"></span>
                </span>
                <p className="text-xs font-bold text-slate-800 leading-snug">{statusMessage}</p>
              </div>

              {/* Crawl logs terminal style */}
              <div className="bg-slate-900 rounded-xl p-3.5 font-mono text-[9px] text-emerald-400 leading-normal flex flex-col gap-1 shadow-inner h-28 overflow-y-auto select-none">
                {syncLogs.map((log, i) => (
                  <div key={i} className="flex gap-1.5 items-start">
                    <span className="text-slate-500 shrink-0">❯</span>
                    <span>{log}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Informative bottom card */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex gap-3 mt-6">
          <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-gray-800">Şifre veya Giriş İstenmez</span>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Bu işlem Instagram API sınırları içerisinde, gizliliğinizi korumak amacıyla şifresiz taranır. Profiliniz herkese açık (Public) olduğu sürece tüm dökümanlar çözümlenir ve planlama panelinize güvenle yerleştirilir. Gizli (Private) hesapların verilerine erişim sağlanamaz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
