import React, { useRef } from 'react';
import { THEMES, BACKGROUNDS } from '../data/templates';
import { LayoutStyle, BackgroundStyle } from '../types';
import {
  Sparkles,
  Layout,
  Palette,
  Type,
  Smile,
  Heart,
  Download,
  PartyPopper,
  Upload,
  Crown,
  Flame,
  Zap,
  Image as ImageIcon,
} from 'lucide-react';

interface ToolbarProps {
  layout: LayoutStyle;
  background: BackgroundStyle;
  onChangeLayout: (layout: LayoutStyle) => void;
  onChangeBackground: (bg: BackgroundStyle) => void;
  onOpenStickers: () => void;
  onOpenTextConfig: () => void;
  onOpenWishes: () => void;
  onOpenExport: () => void;
  onTriggerConfetti: () => void;
  onBatchUpload: (files: FileList) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  layout,
  background,
  onChangeLayout,
  onChangeBackground,
  onOpenStickers,
  onOpenTextConfig,
  onOpenWishes,
  onOpenExport,
  onTriggerConfetti,
  onBatchUpload,
}) => {
  const batchInputRef = useRef<HTMLInputElement>(null);

  const getThemeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Crown':
        return <Crown size={16} />;
      case 'Sparkles':
        return <Sparkles size={16} />;
      case 'Flame':
        return <Flame size={16} />;
      case 'PartyPopper':
        return <PartyPopper size={16} />;
      case 'Zap':
        return <Zap size={16} />;
      case 'Image':
      default:
        return <ImageIcon size={16} />;
    }
  };

  const handleBatchFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onBatchUpload(e.target.files);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-3.5 mb-6">
      {/* Top Header Row with Quick Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/70 border border-white/70 p-3.5 sm:p-4 rounded-3xl shadow-lg shadow-slate-200/50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/30">
            🎂
          </div>
          <div>
            <h2 className="text-base font-black text-slate-800 tracking-wide">
              Праздничный Коллаж
            </h2>
            <p className="text-xs text-amber-600 font-medium">
              Праздничный коллаж • 7 памятных фото
            </p>
          </div>
        </div>

        {/* Right Main Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Batch Upload Button */}
          <button
            type="button"
            onClick={() => batchInputRef.current?.click()}
            className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-amber-700 text-xs font-bold border border-slate-200 shadow-sm flex items-center gap-1.5 transition-all hover:scale-102"
            title="Загрузить сразу несколько фото"
          >
            <Upload size={15} />
            <span>Загрузить фото</span>
          </button>
          <input
            ref={batchInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleBatchFileChange}
          />

          {/* Confetti & Fanfare Celebration Button */}
          <button
            type="button"
            onClick={onTriggerConfetti}
            className="px-3.5 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-400 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-pink-500/25 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
            title="Запустить праздничный салют и музыку"
          >
            <PartyPopper size={15} />
            <span>Салют! 🎉</span>
          </button>

          {/* Download & Export High-Res */}
          <button
            type="button"
            id="btn-export-collage"
            onClick={onOpenExport}
            className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 text-xs font-black shadow-xl shadow-amber-500/30 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
          >
            <Download size={16} />
            <span>Скачать коллаж</span>
          </button>
        </div>
      </div>

      {/* Second Row: Layout Templates & Creative Tools */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Layout Styles Selector */}
        <div className="md:col-span-8 bg-white/70 border border-slate-200 p-3 rounded-2xl flex flex-col gap-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <Layout size={13} />
              <span>Шаблоны расположения:</span>
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {THEMES.map((th) => (
              <button
                key={th.id}
                type="button"
                onClick={() => onChangeLayout(th.id)}
                className={`px-2.5 py-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 transition-all ${
                  layout === th.id
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20 ring-1 ring-amber-300 scale-102'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 border border-slate-200'
                }`}
              >
                {getThemeIcon(th.icon)}
                <span className="text-[10px] leading-tight text-center truncate w-full">
                  {th.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Tool Buttons */}
        <div className="md:col-span-4 bg-white/70 border border-slate-200 p-3 rounded-2xl flex flex-col justify-between gap-2 shadow-sm">
          <span className="text-[11px] font-bold text-amber-300/90 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>Оформление:</span>
          </span>

          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={onOpenTextConfig}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex flex-col items-center justify-center gap-1 transition-colors text-xs font-bold"
              title="Изменить текст и шрифты"
            >
              <Type size={15} className="text-amber-400" />
              <span className="text-[10px]">Надпись</span>
            </button>

            <button
              type="button"
              onClick={onOpenStickers}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex flex-col items-center justify-center gap-1 transition-colors text-xs font-bold"
              title="Добавить стикеры и бейджи"
            >
              <Smile size={15} className="text-amber-400" />
              <span className="text-[10px]">Стикеры</span>
            </button>

            <button
              type="button"
              onClick={onOpenWishes}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex flex-col items-center justify-center gap-1 transition-colors text-xs font-bold"
              title="Готовые пожелания"
            >
              <Heart size={15} className="text-rose-400" />
              <span className="text-[10px]">Пожелания</span>
            </button>
          </div>
        </div>
      </div>

      {/* Third Row: Background Color Palette Swatches */}
      <div className="bg-white/60 border border-slate-200 px-3.5 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-2 shadow-sm">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <Palette size={13} className="text-amber-400" />
          <span>Фоновое оформление:</span>
        </span>

        <div className="flex items-center flex-wrap gap-2">
          {BACKGROUNDS.map((bg) => (
            <button
              key={bg.id}
              type="button"
              onClick={() => onChangeBackground(bg.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                background === bg.id
                  ? 'bg-amber-100 border-2 border-amber-400 text-amber-700 shadow-md'
                  : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-500 hover:text-slate-700'
              }`}
            >
              <span
                className="w-3.5 h-3.5 rounded-full shadow-inner border border-white/20"
                style={{ background: bg.preview }}
              />
              <span className="text-[11px]">{bg.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
