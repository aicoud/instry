import React, { useState, useRef } from 'react';
import { ChevronLeft, Check, Image as ImageIcon, Copy } from 'lucide-react';
import { presetFilters, getFilterStyle, defaultCustomFilters } from '../filters';
import { PostMedia } from '../types';

interface PhotoEditorModalProps {
  onClose: () => void;
  onSave: (photoData: {
    media: PostMedia[];
    caption: string;
  }) => void;
}

export function PhotoEditorModal({ onClose, onSave }: PhotoEditorModalProps) {
  const [step, setStep] = useState<'upload' | 'filter' | 'caption'>('upload');
  
  const [mediaItems, setMediaItems] = useState<PostMedia[]>([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  const [activeAdustment, setActiveAdjustment] = useState<keyof typeof defaultCustomFilters | null>(null);
  const [caption, setCaption] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const filePromises = Array.from(files).map((file) => {
      return new Promise<PostMedia>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve({
            imageUrl: event.target?.result as string,
            filterClass: '',
            customFilters: { ...defaultCustomFilters }
          });
        };
        reader.readAsDataURL(file as File);
      });
    });

    const items = await Promise.all(filePromises);
    if (items.length > 0) {
      setMediaItems(items);
      setActiveMediaIndex(0);
      setStep('filter');
    }
  };

  const handleNext = () => {
    if (step === 'filter') {
      setStep('caption');
    } else if (step === 'caption') {
      if (mediaItems.length > 0) {
        onSave({
          media: mediaItems,
          caption,
        });
      }
    }
  };

  const handleBack = () => {
    if (step === 'caption') setStep('filter');
    else if (step === 'filter') setStep('upload');
    else onClose();
  };

  const updateActiveMedia = (updates: Partial<PostMedia>) => {
    const newItems = [...mediaItems];
    newItems[activeMediaIndex] = { ...newItems[activeMediaIndex], ...updates };
    setMediaItems(newItems);
  };
  
  const activeMedia = mediaItems[activeMediaIndex];

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col max-w-xl mx-auto overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-[calc(12px+env(safe-area-inset-top,0px))] pb-3 border-b border-gray-100 bg-white shadow-sm shrink-0">
        <button onClick={handleBack} className="p-1">
          <ChevronLeft className="w-7 h-7 stroke-[1.5]" />
        </button>
        <h2 className="text-xl font-semibold">
          {step === 'upload' ? 'Yeni Gönderi' : step === 'filter' ? 'Filtreler' : 'Paylaş'}
        </h2>
        {step !== 'upload' ? (
          <button onClick={handleNext} className="text-blue-500 font-semibold text-lg px-2">
            İleri
          </button>
        ) : (
          <div className="w-8" />
        )}
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto flex flex-col bg-gray-50">
        {step === 'upload' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
             <div className="w-24 h-24 rounded-full border-2 border-black flex items-center justify-center mb-6">
                <ImageIcon className="w-12 h-12 stroke-[1.5]" />
             </div>
             <h3 className="text-xl font-medium mb-4">Fotoğraf Seçin</h3>
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-600 transition"
              >
                  Galeriden Yükle
             </button>
             <input 
                type="file" 
                accept="image/*" 
                multiple
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
              />
          </div>
        )}

        {step === 'filter' && mediaItems.length > 0 && activeMedia && (
          <div className="flex flex-col h-full bg-white">
            {/* Image Preview Container */}
            <div className="w-full aspect-square bg-gray-900 shrink-0 relative overflow-hidden">
               <div 
                 className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                 onScroll={(e) => {
                    const scrollLeft = e.currentTarget.scrollLeft;
                    const width = e.currentTarget.clientWidth;
                    setActiveMediaIndex(Math.round(scrollLeft / width));
                 }}
               >
                 {mediaItems.map((m, idx) => (
                    <div key={idx} className="w-full h-full shrink-0 snap-center relative">
                      <img 
                        src={m.imageUrl} 
                        alt="Preview" 
                        className={`w-full h-full object-cover transition-all duration-300 ${m.filterClass}`}
                        style={getFilterStyle(m.customFilters)}
                      />
                    </div>
                 ))}
               </div>
               
               {mediaItems.length > 1 && (
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
                    {mediaItems.map((_, i) => (
                      <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === activeMediaIndex ? 'bg-blue-500' : 'bg-white/50'}`} />
                    ))}
                  </div>
               )}
            </div>

            {/* Editing Controls */}
            <div className="flex-1 flex flex-col">
              {/* Tab Bar */}
              <div className="flex border-b border-gray-200 shrink-0">
                <button 
                  className={`flex-1 py-3 text-sm font-semibold border-b-2 ${!activeAdustment ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                  onClick={() => setActiveAdjustment(null)}
                >
                  Filtreler
                </button>
                <button 
                  className={`flex-1 py-3 text-sm font-semibold border-b-2 ${activeAdustment ? 'border-black text-black' : 'border-transparent text-gray-400'}`}
                  onClick={() => setActiveAdjustment('brightness')}
                >
                  Düzenle
                </button>
              </div>

              {/* Tools Area */}
              <div className="flex-1 overflow-y-auto bg-white p-4">
                {!activeAdustment ? (
                  // Presets Grid
                  <div className="grid grid-cols-3 gap-2 overflow-x-auto pb-4">
                    {presetFilters.map((filter) => (
                      <button
                        key={filter.name}
                        onClick={() => updateActiveMedia({ filterClass: filter.class })}
                        className="flex flex-col items-center gap-1 group"
                      >
                        <div className={`w-full aspect-square rounded-md overflow-hidden relative ${activeMedia.filterClass === filter.class ? 'border-2 border-blue-500' : 'border border-gray-200'}`}>
                          <img 
                            src={activeMedia.imageUrl} 
                            alt={filter.name} 
                            className={`w-full h-full object-cover ${filter.class}`} 
                          />
                        </div>
                        <span className={`text-xs ${activeMedia.filterClass === filter.class ? 'font-semibold text-blue-500' : 'text-gray-500 group-hover:text-black'}`}>
                          {filter.name}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  // Custom Adjustments
                  <div className="flex flex-col gap-6 pt-4">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {(['brightness', 'contrast', 'saturation', 'sepia', 'grayscale'] as const).map((tool) => (
                        <button
                          key={tool}
                          onClick={() => setActiveAdjustment(tool)}
                          className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap ${
                            activeAdustment === tool ? 'bg-black text-white' : 'bg-gray-100 text-black'
                          }`}
                        >
                          {tool === 'brightness' ? 'Parlaklık' : 
                           tool === 'contrast' ? 'Kontrast' : 
                           tool === 'saturation' ? 'Doygunluk' : 
                           tool === 'sepia' ? 'Sepya' : 'Siyah Beyaz'}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-col gap-3 px-2">
                       <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase tracking-widest">
                         <span>0</span>
                         <span>{activeMedia.customFilters[activeAdustment]}</span>
                         <span>200</span>
                       </div>
                       <input 
                         type="range"
                         min="0"
                         max="200"
                         value={activeMedia.customFilters[activeAdustment]}
                         onChange={(e) => updateActiveMedia({
                           customFilters: {
                             ...activeMedia.customFilters,
                             [activeAdustment]: Number(e.target.value)
                           }
                         })}
                         className="w-full accent-black"
                       />
                       <button 
                         onClick={() => updateActiveMedia({
                           customFilters: {
                             ...activeMedia.customFilters,
                             [activeAdustment]: defaultCustomFilters[activeAdustment]
                           }
                         })}
                         className="text-xs text-blue-500 font-semibold self-start mt-2"
                       >
                         Sıfırla
                       </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 'caption' && mediaItems.length > 0 && (
          <div className="flex flex-col p-4 bg-white h-full">
            <div className="flex gap-4">
              <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden relative bg-gray-100">
                <img 
                  src={mediaItems[0].imageUrl} 
                  alt="Thumbnail" 
                  className={`w-full h-full object-cover ${mediaItems[0].filterClass}`}
                  style={getFilterStyle(mediaItems[0].customFilters)}
                />
                {mediaItems.length > 1 && <Copy className="absolute top-1 right-1 w-3 h-3 text-white drop-shadow-md scale-x-[-1]"/>}
              </div>
              <textarea
                placeholder="Bir açıklama yaz..."
                className="flex-1 resize-none outline-none min-h-[100px] py-1 text-sm placeholder:text-gray-400"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                autoFocus
              />
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 flex flex-col gap-3">
               <div className="flex justify-between items-center text-sm py-2">
                 <span>Kişileri Etiketle</span>
                 <ChevronLeft className="w-5 h-5 rotate-180 text-gray-400" />
               </div>
               <div className="flex justify-between items-center text-sm py-2">
                 <span>Konum Ekle</span>
                 <ChevronLeft className="w-5 h-5 rotate-180 text-gray-400" />
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
