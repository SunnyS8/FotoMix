import React, { useState } from 'react';
import { PhotoSlot } from '../types';
import { X, Upload, RotateCw, ZoomIn, ZoomOut, Check, Sliders, Trash2 } from 'lucide-react';

interface PhotoEditorModalProps {
  photo: PhotoSlot;
  isHero: boolean;
  onClose: () => void;
  onSave: (updated: PhotoSlot) => void;
  onSetHero: (id: string) => void;
  onUploadNew: (id: string, file: File) => void;
}

export const PhotoEditorModal: React.FC<PhotoEditorModalProps> = ({
  photo,
  isHero,
  onClose,
  onSave,
  onSetHero,
  onUploadNew,
}) => {
  const [current, setCurrent] = useState<PhotoSlot>({ ...photo });
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filters: { id: PhotoSlot['filter']; name: string; icon: string }[] = [
    { id: 'none', name: 'Оригинал', icon: '🎨' },
    { id: 'festive', name: 'Праздничный', icon: '✨' },
    { id: 'vivid', name: 'Яркий', icon: '🌈' },
    { id: 'warm', name: 'Тёплый', icon: '☀️' },
    { id: 'vintage', name: 'Полароид', icon: '🎞️' },
    { id: 'bw', name: 'Чёрно-белый', icon: '🖤' },
    { id: 'soft', name: 'Мягкий', icon: '🌸' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      setCurrent((prev) => ({ ...prev, url }));
      onUploadNew(photo.id, file);
    }
  };

  const rotate90 = () => {
    setCurrent((prev) => ({ ...prev, rotation: (prev.rotation + 90) % 360 }));
  };

  const resetAll = () => {
    setCurrent((prev) => ({
      ...prev,
      zoom: 1,
      rotation: 0,
      offsetX: 0,
      offsetY: 0,
      filter: 'none',
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-700/30 backdrop-blur-md animate-fadeIn">
      <div
        id="photo-editor-modal"
        className="w-full max-w-xl sm:max-w-2xl bg-white/90 backdrop-blur-xl border border-white/70 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-slate-300/50 text-slate-800 flex flex-col gap-5 max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Sliders size={20} className="text-amber-500" />
            <h3 className="text-lg font-bold text-slate-800">Редактор фотографии</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Preview Screen */}
        <div className="relative w-full h-72 sm:h-96 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
          {current.url ? (
            <div
              className="w-full h-full flex items-center justify-center overflow-hidden"
              style={{
                transform: `scale(${current.zoom}) rotate(${current.rotation}deg) translate(${current.offsetX}px, ${current.offsetY}px)`,
              }}
            >
              <img
                src={current.url}
                alt="Предпросмотр"
                className="w-full h-full object-contain select-none"
              />
            </div>
          ) : (
            <div className="text-center p-4 text-slate-500 flex flex-col items-center gap-2">
              <Upload size={32} className="text-amber-500 animate-bounce" />
              <p className="text-sm font-medium">Фотография еще не загружена</p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-transform hover:scale-105"
              >
                Выбрать файл с устройства
              </button>
            </div>
          )}

          {/* Quick upload button */}
          <div className="absolute top-2 right-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-white/90 hover:bg-slate-100 text-amber-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-200 backdrop-blur-md shadow-md"
            >
              <Upload size={14} />
              <span>{current.url ? 'Заменить фото' : 'Загрузить фото'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>

        {/* Caption Input */}
        <div>
          <label className="block text-xs font-semibold text-amber-600 mb-1.5">
            Подпись к карточке (воспоминание, смайлик, момент):
          </label>
          <input
            type="text"
            value={current.caption || ''}
            onChange={(e) => setCurrent((prev) => ({ ...prev, caption: e.target.value }))}
            placeholder="Например: 🍕 Вкуснейшая пицца!"
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Filter Selection */}
        <div>
          <label className="block text-xs font-semibold text-amber-600 mb-2">
            Праздничный фильтр:
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setCurrent((prev) => ({ ...prev, filter: f.id }))}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                  current.filter === f.id
                    ? 'border-amber-400 bg-amber-100 text-amber-700 shadow-md ring-1 ring-amber-400'
                    : 'border-slate-200 bg-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                <span className="text-base">{f.icon}</span>
                <span className="text-[10px] font-medium leading-tight text-center">{f.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Adjustments: Zoom & Rotate */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span>Масштаб (Зум)</span>
              <span className="font-bold text-amber-600">{Math.round(current.zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <ZoomOut size={16} className="text-slate-400" />
              <input
                type="range"
                min="0.8"
                max="2.5"
                step="0.05"
                value={current.zoom}
                onChange={(e) => setCurrent((prev) => ({ ...prev, zoom: parseFloat(e.target.value) }))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <ZoomIn size={16} className="text-slate-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span>Поворот</span>
              <button
                type="button"
                onClick={rotate90}
                className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 hover:underline"
              >
                <RotateCw size={12} /> +90°
              </button>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              step="5"
              value={current.rotation}
              onChange={(e) => setCurrent((prev) => ({ ...prev, rotation: parseInt(e.target.value, 10) }))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Hero Photo Switcher */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-amber-100 to-transparent border border-amber-300/50">
          <div>
            <p className="text-xs font-bold text-amber-700">Сделать главным фото коллажа</p>
            <p className="text-[11px] text-slate-500">Это фото займёт центральное место</p>
          </div>
          <button
            type="button"
            onClick={() => onSetHero(photo.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isHero
                ? 'bg-amber-400 text-slate-950 shadow-md ring-2 ring-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {isHero ? '★ Главное' : 'Сделать главным'}
          </button>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
          <button
            type="button"
            onClick={resetAll}
            className="text-xs font-semibold text-slate-400 hover:text-slate-700 transition-colors"
          >
            Сбросить настройки
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors"
            >
              Отмена
            </button>
            <button
              type="button"
              onClick={() => {
                onSave(current);
                onClose();
              }}
              className="px-5 py-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/25 flex items-center gap-1.5 transition-transform hover:scale-105"
            >
              <Check size={16} />
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
