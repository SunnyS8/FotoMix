import React from 'react';
import { BIRTHDAY_WISHES } from '../data/templates';
import { X, Heart, Check, Copy } from 'lucide-react';

interface WishesModalProps {
  onClose: () => void;
  onSelectWish: (wish: string) => void;
}

export const WishesModal: React.FC<WishesModalProps> = ({
  onClose,
  onSelectWish,
}) => {
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div
        id="wishes-modal"
        className="w-full max-w-lg bg-slate-900 border border-amber-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-rose-400 fill-rose-400/30" />
            <h3 className="text-lg font-bold text-white">Праздничные поздравления</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Выберите понравившееся пожелание, чтобы добавить его в подзаголовок коллажа, или скопируйте для праздничной открытки:
        </p>

        {/* Wishes List */}
        <div className="flex flex-col gap-3">
          {BIRTHDAY_WISHES.map((wish, idx) => (
            <div
              key={idx}
              className="group bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-amber-500/50 p-4 rounded-2xl transition-all duration-200 flex flex-col gap-3 shadow-md"
            >
              <p className="text-sm text-slate-200 leading-relaxed font-medium">
                «{wish}»
              </p>

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60">
                <button
                  type="button"
                  onClick={() => handleCopy(wish, idx)}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  {copiedIdx === idx ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-emerald-400">Скопировано!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Скопировать</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onSelectWish(wish);
                    onClose();
                  }}
                  className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-transform hover:scale-105 shadow-md shadow-amber-500/20"
                >
                  <Check size={14} />
                  <span>Вставить в коллаж</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
