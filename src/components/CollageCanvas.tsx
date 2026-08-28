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
import { StickerElement } from './StickerElement';
import { Sparkles, Crown, PartyPopper, Star, Flame } from 'lucide-react';

interface CollageCanvasProps {
  photos: PhotoSlot[];
  layout: LayoutStyle;
  background: BackgroundStyle;
  textConfig: BirthdayTextConfig;
  stickers: StickerItem[];
  selectedStickerId: string | null;
  heroPhotoId: string;
  onSelectSticker: (id: string | null) => void;
  onUpdateSticker: (id: string, updated: Partial<StickerItem>) => void;
  onRemoveSticker: (id: string) => void;
  onEditPhoto: (photo: PhotoSlot) => void;
  onUploadPhoto: (id: string, file: File) => void;
  onSetHeroPhoto: (id: string) => void;
}

export const CollageCanvas: React.FC<CollageCanvasProps> = ({
  photos,
  layout,
  background,
  textConfig,
  stickers,
  selectedStickerId,
  heroPhotoId,
  onSelectSticker,
  onUpdateSticker,
  onRemoveSticker,
  onEditPhoto,
  onUploadPhoto,
}) => {
  const currentBg = BACKGROUNDS.find((b) => b.id === background) || BACKGROUNDS[0];

  // Helper for font class
  const getFontFamily = () => {
    switch (textConfig.fontFamily) {
      case 'Russo One':
        return "'Russo One', sans-serif";
      case 'Pacifico':
        return "'Pacifico', cursive";
      case 'Marck Script':
        return "'Marck Script', cursive";
      case 'Comfortaa':
        return "'Comfortaa', cursive";
      case 'Caveat':
        return "'Caveat', cursive";
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

  return (
    <div
      id="collage-export-target"
      onClick={() => onSelectSticker(null)}
      className={`relative w-full max-w-5xl mx-auto min-h-[720px] rounded-3xl p-4 sm:p-7 shadow-2xl overflow-hidden transition-all duration-500 select-none ${currentBg.class}`}
      style={{
        boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(245, 158, 11, 0.15)',
      }}
    >
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
      <div className="relative z-20 text-center mb-6 px-2">
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
        {/* LAYOUT 1: HERO MOSAIC (1 Big Center + 6 Surroundings) */}
        {layout === 'mosaic-hero' && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4.5 items-stretch">
            {/* Left 2 Photos */}
            <div className="md:col-span-3 flex flex-col gap-3.5 sm:gap-4">
              <PhotoCard
                photo={sidePhotos[0] || photos[0]}
                index={0}
                layout={layout}
                onEdit={onEditPhoto}
                onUpload={onUploadPhoto}
              />
              <PhotoCard
                photo={sidePhotos[1] || photos[1]}
                index={1}
                layout={layout}
                onEdit={onEditPhoto}
                onUpload={onUploadPhoto}
              />
            </div>

            {/* Center Big Hero Photo */}
            <div className="md:col-span-6 flex flex-col">
              <div className="flex-1 relative">
                <PhotoCard
                  photo={heroPhoto}
                  index={6}
                  layout={layout}
                  isHero={true}
                  onEdit={onEditPhoto}
                  onUpload={onUploadPhoto}
                />
              </div>
            </div>

            {/* Right 2 Photos */}
            <div className="md:col-span-3 flex flex-col gap-3.5 sm:gap-4">
              <PhotoCard
                photo={sidePhotos[2] || photos[2]}
                index={2}
                layout={layout}
                onEdit={onEditPhoto}
                onUpload={onUploadPhoto}
              />
              <PhotoCard
                photo={sidePhotos[3] || photos[3]}
                index={3}
                layout={layout}
                onEdit={onEditPhoto}
                onUpload={onUploadPhoto}
              />
            </div>

            {/* Bottom 2 Photos */}
            <div className="md:col-span-6">
              <PhotoCard
                photo={sidePhotos[4] || photos[4]}
                index={4}
                layout={layout}
                onEdit={onEditPhoto}
                onUpload={onUploadPhoto}
              />
            </div>
            <div className="md:col-span-6">
              <PhotoCard
                photo={sidePhotos[5] || photos[5]}
                index={5}
                layout={layout}
                onEdit={onEditPhoto}
                onUpload={onUploadPhoto}
              />
            </div>
          </div>
        )}

        {/* LAYOUT 2: POLAROID SCRAPBOOK (Organic tilted snapshots) */}
        {layout === 'scrapbook' && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 pt-2 pb-6">
            {photos.map((photo, i) => {
              const rotations = ['rotate-[-3deg]', 'rotate-[4deg]', 'rotate-[-2deg]', 'rotate-[3deg]', 'rotate-[-4deg]', 'rotate-[2deg]', 'rotate-[-1deg]'];
              const rotationClass = rotations[i % rotations.length];
              const isLarge = i === 6; // hero photo
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
              const isCenterHero = i === 6;
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
              const isHero = i === 6;
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
          <span>Праздник в кругу самых близких и любимых</span>
        </div>
        <div className="flex items-center gap-2">
          <span>С любовью и радостью! 🎉</span>
        </div>
      </div>
    </div>
  );
};
