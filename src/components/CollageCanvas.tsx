import React from 'react';
import {
  PhotoSlot,
  StickerItem,
  BirthdayTextConfig,
  LayoutStyle,
  BackgroundStyle,
} from '../types';
import { BACKGROUNDS } from '../data/templates';
import { PhotoCard } from './PhotoCard';
import { PhotoElement } from './PhotoElement';
import { StickerElement } from './StickerElement';
import { Sparkles, Crown, PartyPopper, Star, Flame } from 'lucide-react';

interface CollageCanvasProps {
  photos: PhotoSlot[];
  layout: LayoutStyle;
  background: BackgroundStyle;
  customBackground?: string | null;
  textConfig: BirthdayTextConfig;
  stickers: StickerItem[];
  selectedStickerId: string | null;
  selectedPhotoId: string | null;
  heroPhotoId: string;
  onSelectSticker: (id: string | null) => void;
  onSelectPhoto: (id: string | null) => void;
  onUpdateSticker: (id: string, updated: Partial<StickerItem>) => void;
  onUpdatePhoto: (id: string, updated: Partial<PhotoSlot>) => void;
  onRemoveSticker: (id: string) => void;
  onEditPhoto: (photo: PhotoSlot) => void;
  onUploadPhoto: (id: string, file: File) => void;
  onSetHeroPhoto: (id: string) => void;
}

// Default spread position (% of canvas) for a photo in free layout
const getFreeDefaultPos = (index: number, count: number) => {
  const cols = count <= 1 ? 1 : count <= 4 ? 2 : count <= 9 ? 3 : 4;
  const rows = Math.ceil(count / cols);
  const col = index % cols;
  const row = Math.floor(index / cols);
  const x = cols === 1 ? 50 : 14 + (col / (cols - 1)) * 72;
  const y = rows === 1 ? 50 : 16 + (row / (rows - 1)) * 68;
  return { x, y };
};

export const CollageCanvas: React.FC<CollageCanvasProps> = ({
  photos,
  layout,
  background,
  customBackground,
  textConfig,
  stickers,
  selectedStickerId,
  selectedPhotoId,
  heroPhotoId,
  onSelectSticker,
  onSelectPhoto,
  onUpdateSticker,
  onUpdatePhoto,
  onRemoveSticker,
  onEditPhoto,
  onUploadPhoto,
  onSetHeroPhoto,
}) => {
  const canvasRef = React.useRef<HTMLDivElement>(null);
  const currentBg = BACKGROUNDS.find((b) => b.id === background) || BACKGROUNDS[0];

  // Helper for font class
  const getFontFamily = () => {
    switch (textConfig.fontFamily) {
      case 'Rubik':
        return "'Rubik', sans-serif";
      case 'Unbounded':
        return "'Unbounded', sans-serif";
      case 'Comfortaa':
        return "'Comfortaa', cursive";
      case 'Nunito':
        return "'Nunito', sans-serif";
      case 'Manrope':
        return "'Manrope', sans-serif";
      case 'Montserrat':
      default:
        return "'Montserrat', sans-serif";
    }
  };

  // Text title styling & effects
  const getTitleEffect = () => {
    switch (textConfig.effect) {
      case 'gold':
        return 'bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 bg-clip-text text-transparent filter drop-shadow-[0_4px_12px_rgba(245,158,11,0.6)]';
      case 'neon':
        return 'text-cyan-300 filter drop-shadow-[0_0_15px_rgba(34,211,238,0.9)] drop-shadow-[0_0_30px_rgba(217,70,239,0.7)]';
      case '3d':
        return 'text-white filter drop-shadow-[2px_2px_0px_#ef4444] drop-shadow-[4px_4px_0px_#3b82f6] drop-shadow-[6px_6px_0px_#10b981]';
      case 'glow':
        return 'text-amber-300 filter drop-shadow-[0_0_20px_rgba(251,191,36,0.8)]';
      case 'shadow':
        return 'text-white filter drop-shadow-[0_6px_10px_rgba(0,0,0,0.8)]';
      default:
        return 'text-amber-400';
    }
  };

  const getTitleSize = () => {
    switch (textConfig.size) {
      case 'small':
        return 'text-2xl sm:text-3xl md:text-4xl';
      case 'medium':
        return 'text-3xl sm:text-4xl md:text-5xl';
      case 'huge':
        return 'text-4xl sm:text-6xl md:text-7xl';
      case 'large':
      default:
        return 'text-3xl sm:text-5xl md:text-6xl';
    }
  };

  const heroPhoto = photos.find((p) => p.id === heroPhotoId) || photos[photos.length - 1];
  const sidePhotos = photos.filter((p) => p.id !== heroPhoto.id);
  const sideLeft = sidePhotos.slice(0, Math.ceil(sidePhotos.length / 2));
  const sideRight = sidePhotos.slice(Math.ceil(sidePhotos.length / 2));

  return (
    <div
      id="collage-export-target"
      ref={canvasRef}
      onClick={() => {
        onSelectSticker(null);
        onSelectPhoto(null);
      }}
      className={`relative w-full max-w-5xl mx-auto min-h-[720px] rounded-3xl p-4 sm:p-7 shadow-2xl overflow-hidden transition-all duration-500 select-none ${currentBg.class}`}
      style={{
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(245, 158, 11, 0.15)',
      }}
    >
      {/* Custom uploaded background image */}
      {customBackground && (
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${customBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
      )}

      {/* Decorative Gold & Particle Overlays */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glow corner bursts */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />

        {/* Ambient sparkles & confetti dots */}
        <div className="absolute top-12 left-1/4 w-2 h-2 rounded-full bg-amber-300 animate-ping opacity-75" />
        <div className="absolute top-24 right-1/4 w-3 h-3 rounded-full bg-pink-400 animate-pulse opacity-60" />
        <div className="absolute bottom-20 left-16 w-2.5 h-2.5 rounded-full bg-cyan-300 animate-bounce opacity-70" />
        <div className="absolute bottom-32 right-20 w-3 h-3 rounded-full bg-yellow-300 animate-ping opacity-60" />

        {/* Fairy lights garland for polaroid wall */}
        {layout === 'polaroid-wall' && (
          <div className="absolute top-24 left-4 right-4 flex justify-between pointer-events-none z-10">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-1 h-3 bg-slate-700" />
                <div
                  className={`w-3 h-3 rounded-full shadow-lg ${
                    i % 3 === 0
                      ? 'bg-amber-300 shadow-amber-300/80 animate-pulse'
                      : i % 3 === 1
                      ? 'bg-rose-400 shadow-rose-400/80'
                      : 'bg-cyan-300 shadow-cyan-300/80'
                  }`}
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Festive Header Banner */}
      <div className="relative z-20 text-center mb-6 px-2 pointer-events-none">
        {textConfig.badgeText && (
          <div className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500/30 via-yellow-500/20 to-amber-500/30 border border-amber-400/50 backdrop-blur-md text-amber-200 text-xs sm:text-sm font-bold tracking-widest uppercase mb-2 shadow-lg">
            <Sparkles size={14} className="text-amber-400 animate-spin" />
            <span>{textConfig.badgeText}</span>
            <Sparkles size={14} className="text-amber-400 animate-spin" />
          </div>
        )}

        <h1
          id="collage-title"
          style={{ fontFamily: getFontFamily() }}
          className={`font-black tracking-wide leading-tight transition-all duration-300 ${getTitleSize()} ${getTitleEffect()}`}
        >
          {textConfig.title}
        </h1>

        {textConfig.subtitle && (
          <p
            id="collage-subtitle"
            className="mt-2 text-sm sm:text-lg font-medium text-amber-100/90 max-w-2xl mx-auto filter drop-shadow-md"
            style={{ fontFamily: "'Comfortaa', cursive, sans-serif" }}
          >
            {textConfig.subtitle}
          </p>
        )}
      </div>

      {/* Dynamic Photo Layouts for 7 Photos */}
      <div className="relative z-10">
        {/* LAYOUT 1: HERO MOSAIC (1 Big Center + surrounding photos) */}
        {layout === 'mosaic-hero' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4.5 items-stretch">
            {/* Left side photos */}
            <div className="md:col-span-3 flex flex-col gap-3.5 sm:gap-4">
              {sideLeft.map((photo, i) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={i}
                  layout={layout}
                  onEdit={onEditPhoto}
                  onUpload={onUploadPhoto}
                />
              ))}
            </div>

            {/* Center Big Hero Photo */}
            <div className="md:col-span-6 flex flex-col">
              <div className="flex-1 relative">
                <PhotoCard
                  photo={heroPhoto}
                  index={sideLeft.length}
                  layout={layout}
                  isHero={true}
                  onEdit={onEditPhoto}
                  onUpload={onUploadPhoto}
                />
              </div>
            </div>

            {/* Right side photos */}
            <div className="md:col-span-3 flex flex-col gap-3.5 sm:gap-4">
              {sideRight.map((photo, i) => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  index={sideLeft.length + 1 + i}
                  layout={layout}
                  onEdit={onEditPhoto}
                  onUpload={onUploadPhoto}
                />
              ))}
            </div>
          </div>
        )}

        {/* LAYOUT 2: POLAROID SCRAPBOOK (Organic tilted snapshots) */}
        {layout === 'scrapbook' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 pt-2 pb-6">
            {photos.map((photo, i) => {
              const rotations = ['rotate-[-3deg]', 'rotate-[4deg]', 'rotate-[-2deg]', 'rotate-[3deg]', 'rotate-[-4deg]', 'rotate-[2deg]', 'rotate-[-1deg]'];
              const rotationClass = rotations[i % rotations.length];
              const isLarge = photo.id === heroPhotoId; // hero photo
              return (
                <div
                  key={photo.id}
                  className={`${rotationClass} ${isLarge ? 'col-span-2 sm:col-span-2' : 'col-span-1'} transition-transform duration-300 hover:rotate-0 hover:scale-105`}
                >
                  <PhotoCard
                    photo={photo}
                    index={i}
                    layout={layout}
                    isHero={isLarge}
                    onEdit={onEditPhoto}
                    onUpload={onUploadPhoto}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* LAYOUT 3: MAGAZINE COVER (Special Birthday Edition) */}
        {layout === 'magazine' && (
          <div className="relative border-4 border-amber-400/80 rounded-2xl p-4 bg-slate-950/70 backdrop-blur-md">
            {/* Magazine Header Bar */}
            <div className="flex items-center justify-between border-b-2 border-amber-400/50 pb-2 mb-4">
              <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
                ★ СПЕЦИАЛЬНЫЙ ВЫПУСК 2026 ★
              </span>
              <span className="text-xs font-bold text-slate-300">
                №1 В МИРЕ ПРАЗДНИКОВ
              </span>
              <span className="text-xs font-black text-amber-400 tracking-wider">
                BIRTHDAY COLLAGE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Main Headline Photo (Hero) */}
              <div className="md:col-span-7 flex flex-col">
                <PhotoCard
                  photo={heroPhoto}
                  index={6}
                  layout={layout}
                  isHero={true}
                  onEdit={onEditPhoto}
                  onUpload={onUploadPhoto}
                />
              </div>

              {/* Magazine 6 Side Feature Photos */}
              <div className="md:col-span-5 grid grid-cols-2 gap-3">
                {sidePhotos.map((photo, i) => (
                  <div key={photo.id} className="h-full">
                    <PhotoCard
                      photo={photo}
                      index={i}
                      layout={layout}
                      onEdit={onEditPhoto}
                      onUpload={onUploadPhoto}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* LAYOUT 4: FESTIVE GRID (Gold Luxury Bento) */}
        {layout === 'festive-grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
            <div className="sm:col-span-2 md:col-span-2 md:row-span-2">
              <PhotoCard
                photo={heroPhoto}
                index={6}
                layout={layout}
                isHero={true}
                onEdit={onEditPhoto}
                onUpload={onUploadPhoto}
              />
            </div>
            {sidePhotos.map((photo, i) => (
              <div key={photo.id} className="h-full">
                <PhotoCard
                  photo={photo}
                  index={i}
                  layout={layout}
                  onEdit={onEditPhoto}
                  onUpload={onUploadPhoto}
                />
              </div>
            ))}
          </div>
        )}

        {/* LAYOUT 5: COMIC FUN (Pop-art action style) */}
        {layout === 'comic-fun' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo, i) => {
              const isCenterHero = photo.id === heroPhotoId;
              return (
                <div
                  key={photo.id}
                  className={isCenterHero ? 'sm:col-span-2 md:col-span-2' : 'col-span-1'}
                >
                  <PhotoCard
                    photo={photo}
                    index={i}
                    layout={layout}
                    isHero={isCenterHero}
                    onEdit={onEditPhoto}
                    onUpload={onUploadPhoto}
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* LAYOUT 6: POLAROID WALL (Suspended cards on lights) */}
        {layout === 'polaroid-wall' && (
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {photos.map((photo, i) => {
              const isHero = photo.id === heroPhotoId;
              return (
                <div
                  key={photo.id}
                  className={`${isHero ? 'col-span-2' : 'col-span-1'} transition-transform duration-300 hover:scale-105`}
                >
                  <PhotoCard
                    photo={photo}
                    index={i}
                    layout={layout}
                    isHero={isHero}
                    onEdit={onEditPhoto}
                    onUpload={onUploadPhoto}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

        {/* LAYOUT 7: FREE PLACEMENT (user-dragged photos) */}
        {layout === 'free' && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {photos.map((photo, i) => {
              const pos = photo.x == null || photo.y == null
                ? getFreeDefaultPos(i, photos.length)
                : { x: photo.x, y: photo.y };
              return (
                <PhotoElement
                  key={photo.id}
                  photo={{ ...photo, x: pos.x, y: pos.y }}
                  isSelected={selectedPhotoId === photo.id}
                  isHero={photo.id === heroPhotoId}
                  onSelect={() => onSelectPhoto(photo.id)}
                  onUpdate={(updated) => onUpdatePhoto(photo.id, updated)}
                  onEdit={onEditPhoto}
                  onSetHero={onSetHeroPhoto}
                  onBringToFront={(id) => onUpdatePhoto(id, { zIndex: 100 })}
                />
              );
            })}
          </div>
        )}

      {/* Draggable & Positionable Stickers Layer */}
      <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden">
        {stickers.map((sticker) => (
          <div key={sticker.id} className="pointer-events-auto">
            <StickerElement
              sticker={sticker}
              isSelected={selectedStickerId === sticker.id}
              onSelect={() => onSelectSticker(sticker.id)}
              onUpdate={(updated) => onUpdateSticker(sticker.id, updated)}
              onRemove={() => onRemoveSticker(sticker.id)}
            />
          </div>
        ))}
      </div>

      {/* Bottom festive watermark / date */}
        <div className="relative z-20 mt-6 pt-4 border-t border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-amber-200/70">
          <div className="flex items-center gap-1.5">
            <Star size={14} className="text-amber-400" />
            <span>{textConfig.footerLeft || 'Праздник в кругу самых близких и любимых'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{textConfig.footerRight || 'С любовью и радостью! 🎉'}</span>
          </div>
        </div>
    </div>
  );
};
