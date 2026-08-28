import React from 'react';
import { STICKER_PACK } from '../data/templates';
import { X, Sparkles, Smile, Tag } from 'lucide-react';
import { StickerItem } from '../types';

interface StickerPickerModalProps {
  onClose: () => void;
  onAddEmoji: (emoji: string) => void;
  onAddBadge: (badgeText: string) => void;
}

export const StickerPickerModal: React.FC<StickerPickerModalProps> = ({
  onClose,
  onAddEmoji,
  onAddBadge,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-700/30 backdrop-blur-md animate-fadeIn">
      <div
        id="sticker-picker-modal"
        className="w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/70 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-slate-300/50 text-slate-800 flex flex-col gap-4 max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-amber-500" />
            <h3 className="text-lg font-bold text-slate-800">Добавить праздничный декор</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Categories */}
        <div className="flex flex-col gap-4">
          {STICKER_PACK.map((pack, idx) => (
            <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-1.5 mb-2.5">
                {pack.badges ? (
                  <Tag size={15} className="text-amber-500" />
                ) : (
                  <Smile size={15} className="text-amber-500" />
                )}
                <h4 className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  {pack.category}
                </h4>
              </div>

              {pack.items && (
                <div className="grid grid-cols-6 gap-2">
                  {pack.items.map((emoji, eIdx) => (
                    <button
                      key={eIdx}
                      type="button"
                      onClick={() => {
                        onAddEmoji(emoji);
                        onClose();
                      }}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-amber-100 border border-slate-200 hover:border-amber-400 text-2xl flex items-center justify-center transition-all hover:scale-125"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {pack.badges && (
                <div className="flex flex-wrap gap-2">
                  {pack.badges.map((badge, bIdx) => (
                    <button
                      key={bIdx}
                      type="button"
                      onClick={() => {
                        onAddBadge(badge.text);
                        onClose();
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition-transform hover:scale-105 ${badge.bg}`}
                    >
                      {badge.text}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
