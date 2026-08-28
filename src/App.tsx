/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  PhotoSlot,
  StickerItem,
  BirthdayTextConfig,
  LayoutStyle,
  BackgroundStyle,
  PHOTO_COUNT_OPTIONS,
  MAX_PHOTOS,
} from './types';
import { DEFAULT_PHOTOS } from './data/defaultPhotos';
import { INITIAL_STICKERS, THEMES } from './data/templates';
import { CollageCanvas } from './components/CollageCanvas';
import { Toolbar } from './components/Toolbar';
import { PhotoEditorModal } from './components/PhotoEditorModal';
import { StickerPickerModal } from './components/StickerPickerModal';
import { TextConfigModal } from './components/TextConfigModal';
import { WishesModal } from './components/WishesModal';
import { ExportModal } from './components/ExportModal';
import { soundFX } from './utils/sound';
import { Sparkles, HelpCircle, Heart } from 'lucide-react';

// Derives a human-readable caption from an uploaded file name
// (strips extension, turns _ - . into spaces, capitalizes first letter).
function captionFromFileName(file: File): string {
  const name = file.name.replace(/\.[^.]+$/, '');
  const cleaned = name
    .replace(/[_.\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!cleaned) return '';
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

// Builds the master list of photo slots (defaults + extra empty slots so the
// user can scale the collage up to MAX_PHOTOS without losing edited data).
function buildMasterPhotos(): PhotoSlot[] {
  const extra: PhotoSlot[] = [];
  for (let i = DEFAULT_PHOTOS.length + 1; i <= MAX_PHOTOS; i++) {
    extra.push({
      id: `photo-${i}`,
      url: '',
      caption: '',
      zoom: 1,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      filter: 'festive',
    });
  }
  return [...DEFAULT_PHOTOS, ...extra];
}

export default function App() {
  const [allPhotos, setAllPhotos] = useState<PhotoSlot[]>(buildMasterPhotos);
  const [photoCount, setPhotoCount] = useState<number>(7);
  const photos = allPhotos.slice(0, photoCount);
  const [layout, setLayout] = useState<LayoutStyle>('mosaic-hero');
  const [background, setBackground] = useState<BackgroundStyle>('dark-gold');
  const [customBackground, setCustomBackground] = useState<string | null>(null);
  const [heroPhotoId, setHeroPhotoId] = useState<string>('photo-7');
  const [stickers, setStickers] = useState<StickerItem[]>(INITIAL_STICKERS);
  const [selectedStickerId, setSelectedStickerId] = useState<string | null>(null);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);

  const [textConfig, setTextConfig] = useState<BirthdayTextConfig>({
    title: 'MixFoto',
    subtitle: 'Создай коллаж к празднику',
    fontFamily: 'Montserrat',
    titleColor: '#f59e0b',
    titleGradient: 'from-amber-200 via-yellow-300 to-amber-500',
    subtitleColor: '#fef3c7',
    size: 'large',
    effect: 'gold',
    align: 'center',
    badgeText: 'ГЛАВНЫЙ ИМЕНИННИК ГОДА 👑',
    footerLeft: 'Праздник в кругу самых близких и любимых',
    footerRight: 'С любовью и радостью! 🎉',
  });

  // Modals state
  const [editingPhoto, setEditingPhoto] = useState<PhotoSlot | null>(null);
  const [isStickersOpen, setIsStickersOpen] = useState(false);
  const [isTextConfigOpen, setIsTextConfigOpen] = useState(false);
  const [isWishesOpen, setIsWishesOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  const triggerConfettiCannon = () => {
    soundFX.playFanfare();
    confetti({
      particleCount: 100,
      spread: 90,
      origin: { y: 0.5 },
    });
  };

  const handleUploadSinglePhoto = (id: string, file: File) => {
    const url = URL.createObjectURL(file);
    setAllPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, url, caption: captionFromFileName(file) } : p))
    );
    soundFX.playPop();
  };

  const handleBatchUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    setAllPhotos((prev) => {
      return prev.map((p, idx) => {
        if (fileArray[idx] && idx < photoCount) {
          return {
            ...p,
            url: URL.createObjectURL(fileArray[idx]),
            caption: captionFromFileName(fileArray[idx]),
          };
        }
        return p;
      });
    });

    soundFX.playFanfare();
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSavePhotoEdits = (updated: PhotoSlot) => {
    setAllPhotos((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    soundFX.playPop();
  };

  const handlePhotoCountChange = (n: number) => {
    setPhotoCount(n);
    const ids = allPhotos.slice(0, n).map((p) => p.id);
    if (!ids.includes(heroPhotoId)) {
      setHeroPhotoId(ids[ids.length - 1]);
    }
    soundFX.playPop();
  };

  const handleAddEmojiSticker = (emoji: string) => {
    const newSticker: StickerItem = {
      id: `stk-${Date.now()}`,
      type: 'emoji',
      content: emoji,
      x: 50 + (Math.random() * 20 - 10),
      y: 50 + (Math.random() * 20 - 10),
      size: 48,
      rotation: Math.round(Math.random() * 30 - 15),
      zIndex: 40,
    };
    setStickers((prev) => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
    soundFX.playPop();
  };

  const handleAddBadgeSticker = (badgeText: string) => {
    const newSticker: StickerItem = {
      id: `stk-${Date.now()}`,
      type: 'badge',
      content: badgeText,
      x: 50,
      y: 85,
      size: 16,
      rotation: 0,
      zIndex: 45,
    };
    setStickers((prev) => [...prev, newSticker]);
    setSelectedStickerId(newSticker.id);
    soundFX.playPop();
  };

  const handleUpdateSticker = (id: string, updated: Partial<StickerItem>) => {
    setStickers((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  const handleRemoveSticker = (id: string) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
    if (selectedStickerId === id) {
      setSelectedStickerId(null);
    }
  };

  const handleUpdatePhoto = (id: string, updated: Partial<PhotoSlot>) => {
    setAllPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  const handleSelectWish = (wish: string) => {
    setTextConfig((prev) => ({ ...prev, subtitle: wish }));
    soundFX.playPop();
  };

  const handleLayoutChange = (newLayout: LayoutStyle) => {
    setLayout(newLayout);
    const theme = THEMES.find((t) => t.id === newLayout);
    if (theme) {
      setBackground(theme.defaultBg);
    }
    soundFX.playPop();
  };

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-rose-50 via-white to-amber-50 text-slate-800 p-3 sm:p-6 md:p-8 flex flex-col items-center selection:bg-amber-400 selection:text-white font-sans overflow-hidden">
      {/* Soft decorative glows */}
      <div className="pointer-events-none absolute -top-32 -left-24 w-96 h-96 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-rose-200/40 blur-3xl" />
      {/* Top Toolbar */}
      <Toolbar
        layout={layout}
        background={background}
        photoCount={photoCount}
        onChangePhotoCount={handlePhotoCountChange}
        onChangeLayout={handleLayoutChange}
        onChangeBackground={setBackground}
        customBackground={customBackground}
        onCustomBackground={setCustomBackground}
        onOpenStickers={() => setIsStickersOpen(true)}
        onOpenTextConfig={() => setIsTextConfigOpen(true)}
        onOpenWishes={() => setIsWishesOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onTriggerConfetti={triggerConfettiCannon}
        onBatchUpload={handleBatchUpload}
      />

      {/* Main Interactive Collage Canvas */}
      <main className="w-full flex justify-center">
        <CollageCanvas
          photos={photos}
          layout={layout}
          background={background}
          customBackground={customBackground}
          textConfig={textConfig}
          stickers={stickers}
          selectedStickerId={selectedStickerId}
          selectedPhotoId={selectedPhotoId}
          heroPhotoId={heroPhotoId}
          onSelectSticker={setSelectedStickerId}
          onSelectPhoto={setSelectedPhotoId}
          onUpdateSticker={handleUpdateSticker}
          onUpdatePhoto={handleUpdatePhoto}
          onRemoveSticker={handleRemoveSticker}
          onEditPhoto={(p) => setEditingPhoto(p)}
          onUploadPhoto={handleUploadSinglePhoto}
          onSetHeroPhoto={(id) => setHeroPhotoId(id)}
        />
      </main>

      {/* Quick Helper Tips */}
        <footer className="w-full max-w-5xl mt-6 text-center text-xs text-slate-500 flex flex-wrap items-center justify-center gap-4 py-3 border-t border-slate-200">
          <span className="flex items-center gap-1.5 text-amber-600/90">
            <Sparkles size={14} /> Наведите на любое фото для замены или настройки фильтров
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5 text-slate-500">
            Стикеры можно перетаскивать по холсту, вращать и масштабировать
          </span>
        </footer>

      {/* Modals */}
      {editingPhoto && (
        <PhotoEditorModal
          photo={editingPhoto}
          isHero={heroPhotoId === editingPhoto.id}
          onClose={() => setEditingPhoto(null)}
          onSave={handleSavePhotoEdits}
          onSetHero={(id) => setHeroPhotoId(id)}
          onUploadNew={handleUploadSinglePhoto}
        />
      )}

      {isStickersOpen && (
        <StickerPickerModal
          onClose={() => setIsStickersOpen(false)}
          onAddEmoji={handleAddEmojiSticker}
          onAddBadge={handleAddBadgeSticker}
        />
      )}

      {isTextConfigOpen && (
        <TextConfigModal
          config={textConfig}
          onClose={() => setIsTextConfigOpen(false)}
          onSave={(cfg) => {
            setTextConfig(cfg);
            soundFX.playPop();
          }}
        />
      )}

      {isWishesOpen && (
        <WishesModal
          onClose={() => setIsWishesOpen(false)}
          onSelectWish={handleSelectWish}
        />
      )}

      {isExportOpen && (
        <ExportModal
          onClose={() => setIsExportOpen(false)}
          photos={photos}
          layout={layout}
          background={background}
          textConfig={textConfig}
          stickers={stickers}
          heroPhotoId={heroPhotoId}
        />
      )}
    </div>
  );
}
