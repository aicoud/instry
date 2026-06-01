import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, MailWarning, Loader2 } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (username: string) => void;
  savedProfiles: { username: string, profilePic: string }[];
}

export function AuthScreen({ onLogin, savedProfiles }: AuthScreenProps) {
  const [authMode, setAuthMode] = useState<'main' | 'email_login' | 'email_register' | 'gmail_sim' | 'email_verify'>('main');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Simulated Gmail Login accounts
  const mockGmailAccounts = [
    { email: 'kullanici@gmail.com', name: 'Kullanıcı Adın', pic: '/default_avatar.png', username: 'kullanici_adin' }
  ];

  const handleEmailAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Lütfen e-posta ve şifrenizi girin.');
      return;
    }
    if (authMode === 'email_register' && !username) {
      setErrorMessage('Lütfen bir kullanıcı adı belirleyin.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    // Simulate server request delay
    setTimeout(() => {
      setIsSubmitting(false);
      if (authMode === 'email_register') {
        // Generate a random 4-digit code and shift to Verification Mode
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedOtp(code);
        setAuthMode('email_verify');
      } else {
        const targetUser = username ? username.trim().toLowerCase() : email.split('@')[0].trim().toLowerCase();
        onLogin(targetUser || 'kullanici_adin');
      }
    }, 1200);
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      setErrorMessage('Lütfen 4 haneli onay kodunu girin.');
      return;
    }
    setIsSubmitting(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsSubmitting(false);
      if (otpCode === generatedOtp) {
        const targetUser = username ? username.trim().toLowerCase() : email.split('@')[0].trim().toLowerCase();
        onLogin(targetUser || 'kullanici_adin');
      } else {
        setErrorMessage('Hatalı onay kodu! Lütfen tekrar deneyin.');
      }
    }, 1000);
  };

  const handleGmailLogin = (username: string) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setTimeout(() => {
      setIsSubmitting(false);
      onLogin(username);
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen pt-[calc(30px+env(safe-area-inset-top,0px))] pb-[calc(30px+env(safe-area-inset-bottom,0px))] bg-white text-black p-6 w-full max-w-xl mx-auto border-x border-gray-100 items-center justify-between relative">
      
      {/* Top logo */}
      <div className="w-full flex flex-col items-center mt-12 mb-8">
        <div className="h-16 w-16 bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 rounded-2xl flex items-center justify-center shadow-lg shadow-fuchsia-500/10 mb-5">
          <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <path d="M21 12H3" />
            <path d="M12 3v18" />
          </svg>
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>Instry</h1>
        <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-widest">Estetiğini Önizle</p>
      </div>

      {/* Main Container */}
      <div className="w-full flex-1 flex flex-col items-center justify-center max-w-sm">

        {/* SCREEN 1: MAIN LOGIN CHANNELS */}
        {authMode === 'main' && (
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!username || !password) {
              setErrorMessage('Lütfen kullanıcı adı ve şifrenizi girin.');
              return;
            }
            setIsSubmitting(true);
            setErrorMessage(null);
            setTimeout(() => {
              setIsSubmitting(false);
              const trimmedUser = username.trim();
              const trimmedPass = password.trim();

              if (trimmedUser === 'ai.coud' && trimmedPass === 'aykut1996*') {
                onLogin('formandseek.shop'); // Default to target premium mockup feed profile for the admin login
              } else {
                setErrorMessage('Hatalı kullanıcı adı veya şifre! (Lütfen admin bilgilerini kullanın)');
              }
            }, 1200);
          }} className="w-full flex flex-col gap-3.5 animate-fade-in">
            <h2 className="text-lg font-bold text-gray-800 text-center mb-2">Uygulamaya Giriş Yap</h2>

            {/* Saved Accounts section */}
            {savedProfiles.length > 0 && (
              <div className="w-full mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block text-center mb-3">Kayıtlı Profilinizle Devam Edin</span>
                <div className="flex gap-4 overflow-x-auto pb-2 justify-center">
                  {savedProfiles.map(p => (
                    <button 
                      key={p.username} 
                      type="button"
                      onClick={() => onLogin(p.username)}
                      className="flex flex-col items-center gap-1.5 group active:scale-[0.98] transition"
                    >
                      <img src={p.profilePic} alt={p.username} className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 group-hover:border-blue-500 shadow-sm" />
                      <span className="text-[11px] font-bold text-gray-700">@{p.username}</span>
                    </button>
                  ))}
                </div>
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-gray-100"></div>
                  <span className="flex-shrink-0 mx-3 text-gray-300 text-[9px] font-bold uppercase tracking-wider">veya</span>
                  <div className="flex-grow border-t border-gray-100"></div>
                </div>
              </div>
            )}

            {errorMessage && (
              <div className="bg-red-50 text-red-600 text-xs rounded-xl p-3 border border-red-100 flex items-start gap-2">
                <MailWarning className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Classic Login Fields */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Kullanıcı Adı veya E-Posta</label>
                <input 
                  type="text" 
                  placeholder="kullanici_adi veya e-posta" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-xs font-bold outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Şifre</label>
                <input 
                  type="password" 
                  placeholder="••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-xs font-bold outline-none transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl py-3.5 text-xs flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 transition active:scale-[0.99] cursor-pointer mt-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Giriş Yapılıyor...
                </>
              ) : (
                <>
                  Giriş Yap
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="relative flex items-center py-2.5">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink-0 mx-3 text-gray-300 text-[9px] font-bold uppercase tracking-wider">veya diğeri ile</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            {/* Google / Gmail Login Button */}
            <button
              type="button"
              onClick={() => setAuthMode('gmail_sim')}
              className="w-full py-3.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2.5 text-sm font-bold text-gray-700 shadow-sm active:scale-[0.99] transition duration-200 cursor-pointer"
            >
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.77 14.93 1 12 1 7.37 1 3.4 3.63 1.42 7.42l3.87 3C6.24 7.42 8.87 5.04 12 5.04z" />
                <path fill="#4285F4" d="M23.45 12.3c0-.82-.07-1.6-.22-2.3H12v4.38h6.42c-.28 1.44-1.1 2.66-2.33 3.48l3.62 2.8c2.12-1.95 3.34-4.83 3.34-8.36z" />
                <path fill="#FBBC05" d="M5.3 14.58c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V7.01H1.43C.52 8.82 0 10.85 0 13s.52 4.18 1.43 5.99l3.87-3.01z" />
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.62-2.8c-1.1.74-2.52 1.18-4.34 1.18-3.13 0-5.76-2.38-6.71-5.38H1.42v3.01C3.4 20.37 7.37 23 12 23z" />
              </svg>
              Gmail ile giriş yap
            </button>

            {/* Email Login Button */}
            <button
              type="button"
              onClick={() => setAuthMode('email_login')}
              className="w-full py-3.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 flex items-center justify-center gap-2.5 text-sm font-bold text-gray-700 shadow-sm active:scale-[0.99] transition duration-200 cursor-pointer"
            >
              <Mail className="w-4.5 h-4.5 text-gray-500" />
              E-posta ile giriş yap
            </button>

            {/* Footer switcher */}
            <div className="mt-4 text-center">
              <span className="text-xs text-gray-500 font-medium">Henüz bir hesabınız yok mu? </span>
              <button 
                type="button"
                onClick={() => setAuthMode('email_register')}
                className="text-xs text-blue-500 font-extrabold hover:underline"
              >
                Yeni Hesap Oluştur
              </button>
            </div>
          </form>
        )}

        {/* SCREEN 2: EMAIL LOGIN FORM */}
        {(authMode === 'email_login' || authMode === 'email_register') && (
          <form onSubmit={handleEmailAuthSubmit} className="w-full flex flex-col gap-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-gray-800">
                {authMode === 'email_login' ? 'E-posta ile Giriş Yap' : 'E-posta ile Kayıt Ol'}
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                {authMode === 'email_login' 
                  ? 'Kayıtlı e-posta adresiniz ve şifrenizle giriş yapın.' 
                  : 'Kendi özelleştirilmiş feed planlayıcınızı oluşturmak için kayıt olun.'}
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 text-red-600 text-xs rounded-xl p-3 border border-red-100 flex items-start gap-2">
                <MailWarning className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {authMode === 'email_register' && (
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Kullanıcı Adı (@)</label>
                  <input 
                    type="text" 
                    placeholder="kullanici_adiniz" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_.]/g, ''))}
                    className="w-full bg-gray-50 border border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-xs font-bold outline-none transition-all"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">E-Posta Adresi</label>
                <input 
                  type="email" 
                  placeholder="eposta@adresiniz.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-xs font-bold outline-none transition-all"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Şifre</label>
                <input 
                  type="password" 
                  placeholder="••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3 text-xs font-bold outline-none transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl py-3.5 text-xs flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 transition active:scale-[0.99] cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Giriş Yapılıyor...
                </>
              ) : (
                <>
                  {authMode === 'email_login' ? 'Giriş Yap' : 'Kayıt Ol ve Giriş Yap'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex justify-between items-center mt-3 px-1">
              <button 
                type="button"
                onClick={() => setAuthMode('main')}
                className="text-xs font-bold text-gray-500 hover:text-gray-800"
              >
                Geri Dön
              </button>
              
              <button 
                type="button"
                onClick={() => setAuthMode(authMode === 'email_login' ? 'email_register' : 'email_login')}
                className="text-xs font-extrabold text-blue-500 hover:underline"
              >
                {authMode === 'email_login' ? 'Yeni Hesap Oluştur' : 'Zaten hesabım var'}
              </button>
            </div>
          </form>
        )}

        {/* SCREEN 3: SIMULATED GMAIL LOGIN */}
        {authMode === 'gmail_sim' && (
          <div className="w-full flex flex-col gap-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.77 14.93 1 12 1 7.37 1 3.4 3.63 1.42 7.42l3.87 3C6.24 7.42 8.87 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.45 12.3c0-.82-.07-1.6-.22-2.3H12v4.38h6.42c-.28 1.44-1.1 2.66-2.33 3.48l3.62 2.8c2.12-1.95 3.34-4.83 3.34-8.36z" />
                  <path fill="#FBBC05" d="M5.3 14.58c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V7.01H1.43C.52 8.82 0 10.85 0 13s.52 4.18 1.43 5.99l3.87-3.01z" />
                  <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.62-2.8c-1.1.74-2.52 1.18-4.34 1.18-3.13 0-5.76-2.38-6.71-5.38H1.42v3.01C3.4 20.37 7.37 23 12 23z" />
                </svg>
                Google ile Devam Et
              </h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Bağlanmak istediğiniz Google hesabını seçin:
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-150 rounded-2xl p-2.5 flex flex-col gap-2 shadow-inner">
              {mockGmailAccounts.map(account => (
                <button
                  key={account.email}
                  onClick={() => handleGmailLogin(account.username)}
                  disabled={isSubmitting}
                  className="w-full p-2.5 bg-white hover:bg-slate-50 border border-gray-100 rounded-xl flex items-center gap-3 transition duration-150 text-left cursor-pointer active:scale-[0.99] disabled:opacity-50"
                >
                  <img src={account.pic} alt={account.name} className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-gray-800 block truncate">{account.name}</span>
                    <span className="text-[10px] font-semibold text-gray-400 block truncate">{account.email}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center mt-3">
              <button 
                type="button"
                onClick={() => setAuthMode('main')}
                className="text-xs font-bold text-gray-500 hover:text-gray-800"
              >
                Geri Dön
              </button>
            </div>
          </div>
        )}

        {/* SCREEN 4: EMAIL VERIFICATION (OTP) */}
        {authMode === 'email_verify' && (
          <form onSubmit={handleVerifyOtpSubmit} className="w-full flex flex-col gap-4 animate-fade-in">
            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold text-gray-800">E-Posta Adresinizi Onaylayın</h3>
              <p className="text-xs text-gray-500 font-medium leading-relaxed">
                Lütfen <strong className="text-gray-700">{email}</strong> adresine gönderilen 4 haneli onay kodunu girin.
              </p>
            </div>

            {/* Notification Banner with Mock Code for high-fidelity demo simulation */}
            <div className="bg-blue-50 text-blue-800 text-xs rounded-xl p-3 border border-blue-100 flex flex-col gap-1">
              <span className="font-bold flex items-center gap-1">
                📬 Simüle Edilen E-Posta Bildirimi:
              </span>
              <span>
                "Instry'e hoş geldiniz! Onay kodunuz: <strong className="text-blue-900 text-sm font-extrabold">{generatedOtp}</strong>"
              </span>
            </div>

            {errorMessage && (
              <div className="bg-red-50 text-red-600 text-xs rounded-xl p-3 border border-red-100 flex items-start gap-2">
                <MailWarning className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Onay Kodu</label>
              <input 
                type="text" 
                maxLength={4}
                placeholder="0 0 0 0" 
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-full bg-gray-50 border border-gray-200 focus:border-gray-400 rounded-xl px-4 py-3.5 text-center text-lg font-extrabold tracking-[0.5em] outline-none transition-all"
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl py-3.5 text-xs flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50 transition active:scale-[0.99] cursor-pointer mt-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Doğrulanıyor...
                </>
              ) : (
                <>
                  Kodu Doğrula ve Giriş Yap
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex justify-between items-center mt-2 px-1">
              <button 
                type="button"
                onClick={() => setAuthMode('email_register')}
                className="text-xs font-bold text-gray-500 hover:text-gray-800"
              >
                Geri Dön
              </button>
            </div>
          </form>
        )}

      </div>

      {/* Safety Footer */}
      <div className="w-full flex items-center justify-center gap-2 border-t border-gray-100 pt-5 mt-6 shrink-0">
        <ShieldCheck className="w-5 h-5 text-emerald-500" />
        <span className="text-[10.5px] text-gray-400 font-bold uppercase tracking-wider">Güvenli SSL Veri Bağlantısı</span>
      </div>

    </div>
  );
}
