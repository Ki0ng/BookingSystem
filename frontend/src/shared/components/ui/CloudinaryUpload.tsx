'use client';

import { X, UploadCloud } from 'lucide-react';
import { useCloudinary } from '@/shared/hooks/useCloudinary';
import { CloudinaryResult } from '@/shared/types';

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void;
  onRemoveImage: (url: string) => void;
  images: string[];
  maxImages?: number;
}

const CLOUDINARY_THEME = {
  palette: {
    window: '#FFFFFF',
    windowBorder: '#90A0B3',
    tabIcon: '#2563EB',
    menuIcons: '#5A616A',
    textDark: '#000000',
    textLight: '#FFFFFF',
    link: '#2563EB',
    action: '#2563EB',
    inactiveTabIcon: '#0E2F5A',
    error: '#F43F5E',
    inProgress: '#2563EB',
    complete: '#10B981',
    sourceBg: '#F8FAFC'
  }
};

export const CloudinaryUpload = ({
  onUploadSuccess,
  onRemoveImage,
  images,
  maxImages = 5
}: CloudinaryUploadProps) => {
  const { loaded, openWidget } = useCloudinary();

  const handleOpenWidget = () => {
    openWidget(
      {
        sources: ['local', 'url', 'camera'],
        multiple: true,
        maxFiles: maxImages - images.length,
        styles: CLOUDINARY_THEME
      },
      (error: Error | null, result: CloudinaryResult) => {
        if (!error && result && result.event === 'success') {
          onUploadSuccess(result.info.secure_url);
        }
      }
    );
  };

  return (
    <div className="space-y-6">
      {images.length === 0 ? (
        <button
          type="button"
          onClick={handleOpenWidget}
          disabled={!loaded}
          className="w-full h-48 rounded-[2.5rem] border-2 border-dashed border-slate-200 bg-white hover:border-blue-500 hover:bg-blue-50/50 transition-all duration-500 group flex flex-col items-center justify-center gap-4 shadow-sm"
        >
          <div className="w-16 h-16 rounded-[1.5rem] bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 group-hover:scale-110 transition-all duration-500">
            <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-blue-600" />
          </div>
          <div className="text-center">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 mb-1">Visual Assets Pending</p>
            <p className="text-[10px] font-bold text-slate-400">Add up to {maxImages} high-resolution photos</p>
          </div>
        </button>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((url, i) => (
            <div key={i} className="group relative aspect-video rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
              <img src={url} alt="Hotel" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <button 
                  type="button"
                  onClick={() => onRemoveImage(url)}
                  className="p-2.5 bg-rose-600 text-white rounded-xl hover:scale-110 transition-all shadow-xl shadow-rose-900/20"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          
          {images.length < maxImages && (
            <button
              type="button"
              onClick={handleOpenWidget}
              disabled={!loaded}
              className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                <UploadCloud className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest">Add More</span>
            </button>
          )}
        </div>
      )}
      
      {!loaded && <p className="text-[10px] text-slate-400 font-bold animate-pulse">Initializing uploader...</p>}
    </div>
  );
};
