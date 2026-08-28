import React, { useState } from 'react';
import { BirthdayTextConfig } from '../types';
import { X, Type, Sparkles, Check } from 'lucide-react';

interface TextConfigModalProps {
  config: BirthdayTextConfig;
  onClose: () => void;
  onSave: (config: BirthdayTextConfig) => void;
}

export const TextConfigModal: React.FC<TextConfigModalProps> = ({
  config,
  onClose,
  onSave,
}) => {
  const [current, setCurrent] = useState<BirthdayTextConfig>({ ...config });

  const fontOptions = [
    { name: 'Montserrat (Современный & Чистый)', family: 'Montserrat' },
    { name: 'Rubik (Геометричный & Тёплый)', family: 'Rubik' },
    { name: 'Unbounded (Современный дисплей)', family: 'Unbounded' },
    { name: 'Manrope (Технологичный)', family: 'Manrope' },
    { name: 'Nunito (Мягкий & Дружелюбный)', family: 'Nunito' },
    { name: 'Comfortaa (Округлый & Добрый)', family: 'Comfortaa' },
  ];

  // Festive emoji stickers that can be attached to the title
  const TITLE_DECORATIONS = ['🎉', '🎂', '⭐', '👑', '✨', '🥳', '🎈', '💫', '❤️', '🌟'];

  const effects: { id: BirthdayTextConfig['effect']; name: string; icon: string }[] = [
    { id: 'gold', name: 'Золотой глянец', icon: '👑' },
    { id: 'glow', name: 'Неоновое свечение', icon: '✨' },
    { id: '3d', name: '3D Праздник', icon: '🎈' },
    { id: 'shadow', name: 'Глубокая тень', icon: '🕶️' },
    { id: 'flat', name: 'Классический', icon: '🎨' },
  ];

  const sizes: { id: BirthdayTextConfig['size']; name: string }[] = [
    { id: 'small', name: 'Компактный' },
    { id: 'medium', name: 'Средний' },
    { id: 'large', name: 'Большой' },
    { id: 'huge', name: 'Максимальный' },
  ];

  const badges = [
    'САМЫЙ ЛУЧШИЙ ДЕНЬ В ГОДУ 🌟',
    'ГЛАВНЫЙ ИМЕНИННИК 👑',
    'MAX POWER ⚡ 100%',
    'СУПЕРЗВЕЗДА ДНЯ 🚀',
    'С ДНЁМ РОЖДЕНИЯ! 🎂',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-700/30 backdrop-blur-md animate-fadeIn">
      <div
        id="text-config-modal"
        className="w-full max-w-lg bg-white/90 backdrop-blur-xl border border-white/70 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-slate-300/50 text-slate-800 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Type size={20} className="text-amber-400" />
            <h3 className="text-lg font-bold text-slate-800">Настройка поздравления</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Main Title Input */}
        <div>
          <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
            Главный заголовок:
          </label>
          <input
            type="text"
            value={current.title}
            onChange={(e) => setCurrent((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 bg-white border border-amber-500/40 rounded-2xl text-base font-black text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
        </div>

        {/* Title sticker decorations */}
        <div>
          <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
            Стикеры к заголовку:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {TITLE_DECORATIONS.map((emoji) => {
              const active = current.title.split(/\s+/).filter(Boolean).includes(emoji);
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    const tokens = current.title.split(/\s+/).filter(Boolean);
                    setCurrent((prev) => ({
                      ...prev,
                      title: active
                        ? tokens.filter((t) => t !== emoji).join(' ')
                        : [...tokens, emoji].join(' '),
                    }));
                  }}
                  className={`w-9 h-9 rounded-xl text-xl flex items-center justify-center transition-all ${
                    active
                      ? 'bg-amber-400 shadow-md ring-1 ring-amber-300 scale-105'
                      : 'bg-slate-100 hover:bg-amber-100 border border-slate-200'
                  }`}
                >
                  {emoji}
                </button>
              );
            })}
          </div>
        </div>

        {/* Subtitle / Wishes input */}
        <div>
          <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
            Пожелание / Подзаголовок:
          </label>
          <input
            type="text"
            value={current.subtitle}
            onChange={(e) => setCurrent((prev) => ({ ...prev, subtitle: e.target.value }))}
            placeholder="Пусть каждый день будет полон приключений и радости!"
            className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
        </div>

        {/* Badge Tag */}
        <div>
          <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
            Праздничная лента (бейджик сверху):
          </label>
          <input
            type="text"
            value={current.badgeText}
            onChange={(e) => setCurrent((prev) => ({ ...prev, badgeText: e.target.value }))}
            className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-amber-700 focus:outline-none focus:ring-1 focus:ring-amber-400 mb-2"
          />
          <div className="flex flex-wrap gap-1.5">
            {badges.map((b, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrent((prev) => ({ ...prev, badgeText: b }))}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-500 hover:text-amber-700 border border-slate-200 transition-colors"
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Footer lines */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
              Подпись слева (в подвале):
            </label>
            <input
              type="text"
              value={current.footerLeft}
              onChange={(e) => setCurrent((prev) => ({ ...prev, footerLeft: e.target.value }))}
              placeholder="Праздник в кругу самых близких и любимых"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
              Подпись справа (в подвале):
            </label>
            <input
              type="text"
              value={current.footerRight}
              onChange={(e) => setCurrent((prev) => ({ ...prev, footerRight: e.target.value }))}
              placeholder="С любовью и радостью! 🎉"
              className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
          </div>
        </div>

        {/* Font Family Selection */}
        <div>
          <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
            Шрифт надписи:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {fontOptions.map((f) => (
              <button
                key={f.family}
                type="button"
                onClick={() => setCurrent((prev) => ({ ...prev, fontFamily: f.family }))}
                className={`p-2.5 rounded-xl border text-left text-xs font-bold transition-all ${
                  current.fontFamily === f.family
                    ? 'border-amber-400 bg-amber-500/20 text-amber-600 shadow-md ring-1 ring-amber-400'
                    : 'border-slate-200 bg-slate-100 text-slate-500 hover:border-slate-300'
                }`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Visual Effect */}
        <div>
          <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
            Эффект стиля:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {effects.map((eff) => (
              <button
                key={eff.id}
                type="button"
                onClick={() => setCurrent((prev) => ({ ...prev, effect: eff.id }))}
                className={`p-2 rounded-xl border flex items-center gap-2 text-xs font-bold transition-all ${
                  current.effect === eff.id
                    ? 'border-amber-400 bg-amber-500/20 text-amber-600 ring-1 ring-amber-400'
                    : 'border-slate-200 bg-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                }`}
              >
                <span>{eff.icon}</span>
                <span>{eff.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <label className="block text-xs font-bold text-amber-600 uppercase tracking-wider mb-1.5">
            Размер заголовка:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {sizes.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setCurrent((prev) => ({ ...prev, size: s.id }))}
                className={`p-2 rounded-xl border text-center text-xs font-bold transition-all ${
                  current.size === s.id
                    ? 'border-amber-400 bg-amber-500/20 text-amber-600 ring-1 ring-amber-400'
                    : 'border-slate-200 bg-slate-100 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
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
            Применить
          </button>
        </div>
      </div>
    </div>
  );
};
