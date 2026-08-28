import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundFX } from '../utils/sound';
import { exportCollageImage, renderCollageDirectCanvas, CollageExportData } from '../utils/canvasExporter';
import { PhotoSlot, StickerItem, BirthdayTextConfig, LayoutStyle, BackgroundStyle } from '../types';
import { X, Download, Printer, Copy, Check, Sparkles, Loader2, RefreshCw, Image as ImageIcon } from 'lucide-react';

interface ExportModalProps {
  onClose: () => void;
  photos?: PhotoSlot[];
  layout?: LayoutStyle;
  background?: BackgroundStyle;
  textConfig?: BirthdayTextConfig;
  stickers?: StickerItem[];
  heroPhotoId?: string;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  onClose,
  photos = [],
  layout = 'mosaic-hero',
  background = 'dark-gold',
  textConfig = {
    title: 'MixFoto',
    subtitle: 'Создай коллаж к празднику',
    fontFamily: 'Montserrat',
    titleColor: '#f59e0b',
    titleGradient: '',
    subtitleColor: '#fef3c7',
    size: 'large' as const,
    effect: 'gold' as const,
    align: 'center' as const,
    badgeText: 'ГЛАВНЫЙ ИМЕНИННИК ГОДА 👑',
    footerLeft: 'Праздник в кругу самых близких и любимых',
    footerRight: 'С любовью и радостью! 🎉',
  },
  stickers = [],
  heroPhotoId = 'photo-7',
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const collageData: CollageExportData = {
    photos,
    layout: layout as LayoutStyle,
    background: background as BackgroundStyle,
    textConfig,
    stickers,
    heroPhotoId,
  };

  const generateCanvasImage = async (format: 'png' | 'jpeg'): Promise<string | null> => {
    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const dataUrl = await exportCollageImage(
        'collage-export-target',
        format,
        collageData
      );

      setPreviewUrl(dataUrl);
      setIsGenerating(false);
      return dataUrl;
    } catch (err: any) {
      console.warn('DOM export attempt failed, rendering via Canvas 2D...', err);
      try {
        const directUrl = await renderCollageDirectCanvas(collageData);
        setPreviewUrl(directUrl);
        setIsGenerating(false);
        return directUrl;
      } catch (directErr: any) {
        console.error('All export methods failed:', directErr);
        setErrorMessage('Не удалось сгенерировать изображение. Попробуйте еще раз.');
        setIsGenerating(false);
        return null;
      }
    }
  };

  const handleDownload = async (format: 'png' | 'jpeg') => {
    let url = previewUrl;
    if (!url) {
      url = await generateCanvasImage(format);
    }
    if (!url) return;

    soundFX.playFanfare();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    const link = document.createElement('a');
    link.download = `MixFoto_Коллаж.${format}`;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = async () => {
    let url = previewUrl;
    if (!url) {
      url = await generateCanvasImage('png');
    }
    if (!url) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Печать: MixFoto</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #000; }
              img { max-width: 100%; max-height: 100vh; object-fit: contain; }
              @media print {
                body { background: transparent; }
                img { width: 100%; height: auto; }
              }
            </style>
          </head>
          <body>
            <img src="${url}" onload="window.print();window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleCopyImage = async () => {
    let url = previewUrl;
    if (!url) {
      url = await generateCanvasImage('png');
    }
    if (!url) return;

    try {
      const res = await fetch(url);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      generateCanvasImage('png');
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-700/30 backdrop-blur-md animate-fadeIn">
      <div
        id="export-modal"
        className="w-full max-w-2xl bg-white/90 backdrop-blur-xl border border-white/70 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-slate-300/50 text-slate-800 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={22} className="text-amber-500" />
            <div>
              <h3 className="text-lg font-bold text-slate-800">MixFoto</h3>
              <p className="text-xs text-amber-600">Создай коллаж к празднику</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Preview Frame */}
        <div className="relative w-full h-80 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden p-2">
          {isGenerating ? (
            <div className="flex flex-col items-center gap-3 text-amber-600">
              <Loader2 size={36} className="animate-spin text-amber-500" />
              <p className="text-sm font-semibold">Рендерим коллаж в высоком разрешении...</p>
              <p className="text-xs text-slate-500">Формируем сверхчёткое изображение открытки</p>
            </div>
          ) : previewUrl ? (
            <img
              src={previewUrl}
              alt="Готовый праздничный коллаж"
              className="max-h-full max-w-full object-contain rounded-lg shadow-xl"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-center p-4">
              <ImageIcon size={32} className="text-slate-400" />
              <p className="text-sm text-slate-500">{errorMessage || 'Нажмите кнопку ниже для экспорта'}</p>
              <button
                type="button"
                onClick={() => generateCanvasImage('png')}
                className="mt-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5"
              >
                <RefreshCw size={14} /> Повторить генерацию
              </button>
            </div>
          )}
        </div>

        {/* Download & Export Options */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            disabled={isGenerating}
            onClick={() => handleDownload('png')}
            className="p-3.5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 rounded-2xl font-black text-sm shadow-xl shadow-amber-500/20 flex flex-col items-center justify-center gap-1 transition-transform hover:scale-102 active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            <Download size={20} />
            <span>Скачать PNG</span>
            <span className="text-[10px] font-bold text-slate-800">Максимальное качество</span>
          </button>

          <button
            type="button"
            disabled={isGenerating}
            onClick={() => handleDownload('jpeg')}
            className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm border border-slate-200 flex flex-col items-center justify-center gap-1 transition-transform hover:scale-102 active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            <Download size={20} />
            <span>Скачать JPG</span>
            <span className="text-[10px] font-normal text-slate-500">Компактный размер</span>
          </button>

          <button
            type="button"
            disabled={isGenerating}
            onClick={handlePrint}
            className="p-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold text-sm border border-slate-200 flex flex-col items-center justify-center gap-1 transition-transform hover:scale-102 active:scale-98 disabled:opacity-50 cursor-pointer"
          >
            <Printer size={20} />
            <span>Распечатать</span>
            <span className="text-[10px] font-normal text-slate-500">Формат А4 / Открытка</span>
          </button>
        </div>

        {/* Direct Canvas High-Res alternative button */}
        <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-200 text-xs gap-2">
          <button
            type="button"
            onClick={handleCopyImage}
            disabled={isGenerating}
            className="px-4 py-2 bg-slate-100/80 hover:bg-slate-200 text-slate-600 rounded-xl font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {copied ? (
              <>
                <Check size={16} className="text-emerald-500" />
                <span className="text-emerald-600">Картинка в буфере обмена!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Скопировать для вставки в мессенджер</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-colors cursor-pointer ml-auto"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
