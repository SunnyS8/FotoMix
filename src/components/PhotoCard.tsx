import React from 'react';
import { PhotoSlot, LayoutStyle } from '../types';
import { PHOTO_PLACEHOLDERS } from '../data/defaultPhotos';
import { Upload, RotateCw, ZoomIn, Sparkles, Edit3 } from 'lucide-react';

interface PhotoCardProps {
  photo: PhotoSlot;
  index: number;
  layout: LayoutStyle;
  isHero?: boolean;
  onEdit: (photo: PhotoSlot) => void;
  onUpload: (id: string, file: File) => void;
  onSwap?: (sourceId: string, targetId: string) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  index,
  layout,
  isHero = false,
  onEdit,
  onUpload,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const placeholder = PHOTO_PLACEHOLDERS[photo.id] || {
    bg: 'from-amber-600 to-indigo-900',
    icon: '📸',
    title: `Фото #${index + 1}`,
    accent: 'Максим',
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(photo.id, e.target.files[0]);
    }
  };

  // Filter styles
  const getFilterStyle = (filter: PhotoSlot['filter']) => {
    switch (filter) {
      case 'vivid':
        return 'saturate-150 contrast-110';
      case 'warm':
        return 'sepia-25 saturate-125 brightness-105 hue-rotate-[-5deg]';
      case 'vintage':
        return 'sepia-50 contrast-95 brightness-95';
      case 'bw':
        return 'grayscale contrast-120';
      case 'festive':
        return 'saturate-140 brightness-110 contrast-105';
      case 'soft':
        return 'contrast-90 brightness-105 saturate-110';
      default:
        return '';
    }
  };

  // Card frame styling based on layout
  const getFrameClasses = () => {
    switch (layout) {
      case 'scrapbook':
      case 'polaroid-wall':
        return 'bg-white p-3 pb-8 rounded-sm shadow-xl shadow-black/40 border border-slate-200 text-slate-900 transform transition-transform hover:scale-[1.02] hover:z-20';
      case 'comic-fun':
        return 'bg-white p-2 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-slate-900 transform transition-transform hover:-translate-y-1';
      case 'magazine':
        return 'bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-amber-400/40 shadow-2xl shadow-amber-500/10 text-white';
      case 'festive-grid':
        return 'bg-gradient-to-b from-amber-500/20 to-slate-900/90 p-2 rounded-xl border-2 border-amber-400/50 shadow-lg shadow-amber-950/50';
      case 'mosaic-hero':
      default:
        return isHero
          ? 'bg-gradient-to-b from-amber-400/30 to-slate-900/90 p-2.5 rounded-2xl border-3 border-amber-400 shadow-2xl shadow-amber-500/30'
          : 'bg-slate-900/90 p-2 rounded-xl border border-amber-500/30 shadow-md hover:border-amber-400/70 transition-all';
    }
  };

  return (
    <div
      id={`photo-card-${photo.id}`}
      className={`group relative flex flex-col justify-between overflow-hidden transition-all duration-300 ${getFrameClasses()} ${
        isHero ? 'ring-2 ring-amber-400/50' : ''
      }`}
    >
      {/* Scrapbook Tape / Pin Effect */}
      {layout === 'scrapbook' && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-5 bg-amber-200/80 backdrop-blur-xs rotate-[-2deg] shadow-xs z-20 border-l border-r border-amber-300/40 pointer-events-none" />
      )}

      {/* Fairy lights pin for polaroid wall */}
      {layout === 'polaroid-wall' && (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-4 h-6 bg-amber-600/90 rounded-t-sm shadow-md z-20 pointer-events-none border border-amber-800 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-amber-200 animate-pulse" />
        </div>
      )}

      {/* Comic Badge */}
      {layout === 'comic-fun' && isHero && (
        <div className="absolute -top-2 -right-2 bg-yellow-400 text-black font-black text-xs px-2 py-0.5 rounded-md border-2 border-black rotate-12 shadow-sm z-20">
          MAX HERO! 💥
        </div>
      )}

      {/* Image Container */}
      <div className="relative w-full h-full min-h-[140px] flex-1 overflow-hidden rounded-lg bg-slate-950 flex items-center justify-center">
        {photo.url ? (
          <div
            className="w-full h-full flex items-center justify-center overflow-hidden"
            style={{
              transform: `scale(${photo.zoom}) rotate(${photo.rotation}deg) translate(${photo.offsetX}px, ${photo.offsetY}px)`,
              transition: 'transform 0.15s ease-out',
            }}
          >
            <img
              src={photo.url}
              alt={photo.caption || `Фото Максима #${index + 1}`}
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover select-none pointer-events-none ${getFilterStyle(photo.filter)}`}
            />
          </div>
        ) : (
          /* Rich Illustrated Festive Placeholder */
          <div
            className={`w-full h-full min-h-[130px] p-3 bg-gradient-to-br ${placeholder.bg} flex flex-col items-center justify-center text-center relative overflow-hidden`}
          >
            {/* Background sparkle elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 bg-white/10 rounded-full blur-lg pointer-events-none" />
            <div className="text-3xl sm:text-4xl mb-1 filter drop-shadow-md animate-bounce">
              {placeholder.icon}
            </div>
            <div className="text-xs sm:text-sm font-bold text-white tracking-wide drop-shadow-md">
              {placeholder.title}
            </div>
            <span className="mt-1 text-[10px] sm:text-xs font-semibold px-2 py-0.5 bg-black/40 text-amber-200 rounded-full backdrop-blur-xs border border-white/15">
              {placeholder.accent}
            </span>
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 p-2 z-10">
          <button
            type="button"
            id={`btn-upload-${photo.id}`}
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-full shadow-lg transition-transform hover:scale-110 font-bold"
            title="Загрузить фото"
          >
            <Upload size={16} />
          </button>
          <button
            type="button"
            id={`btn-edit-${photo.id}`}
            onClick={() => onEdit(photo)}
            className="p-2 bg-white hover:bg-slate-100 text-slate-900 rounded-full shadow-lg transition-transform hover:scale-110 font-bold"
            title="Настроить и фильтры"
          >
            <Edit3 size={16} />
          </button>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Caption or Slot Footer */}
      <div className="mt-2 text-center">
        {layout === 'scrapbook' || layout === 'polaroid-wall' ? (
          <p
            className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide line-clamp-1"
            style={{ fontFamily: "'Caveat', cursive, sans-serif", fontSize: '15px' }}
          >
            {photo.caption || `Праздник Максима ❤️`}
          </p>
        ) : (
          <p className="text-[11px] sm:text-xs font-medium text-amber-200/90 line-clamp-1">
            {photo.caption || `Счастливый момент #${index + 1}`}
          </p>
        )}
      </div>
    </div>
  );
};
