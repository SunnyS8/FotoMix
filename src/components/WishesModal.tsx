import React from 'react';
import { BIRTHDAY_WISHES } from '../data/templates';
import { X, Heart, Check, Copy, Pencil, Plus } from 'lucide-react';

interface WishesModalProps {
  onClose: () => void;
  onSelectWish: (wish: string) => void;
}

export const WishesModal: React.FC<WishesModalProps> = ({
  onClose,
  onSelectWish,
}) => {
  const [wishes, setWishes] = React.useState<string[]>(BIRTHDAY_WISHES);
  const [editingIdx, setEditingIdx] = React.useState<number | null>(null);
  const [draft, setDraft] = React.useState('');
  const [custom, setCustom] = React.useState('');
  const [copiedIdx, setCopiedIdx] = React.useState<number | null>(null);

  const applyWish = (text: string) => {
    onSelectWish(text);
    onClose();
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const startEdit = (idx: number) => {
    setEditingIdx(idx);
    setDraft(wishes[idx]);
  };

  const saveEdit = () => {
    if (editingIdx === null) return;
    const value = draft.trim();
    if (value) {
      setWishes((w) => w.map((x, i) => (i === editingIdx ? value : x)));
    }
    setEditingIdx(null);
  };

  const cancelEdit = () => setEditingIdx(null);

  const addCustom = () => {
    const value = custom.trim();
    if (!value) return;
    applyWish(value);
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
          Выберите пожелание, отредактируйте его под себя или напишите своё, а затем
          добавьте в подзаголовок коллажа:
        </p>

        {/* Wishes List */}
        <div className="flex flex-col gap-3">
          {wishes.map((wish, idx) => (
            <div
              key={idx}
              className="group bg-slate-950/70 hover:bg-slate-950 border border-slate-800 hover:border-amber-500/50 p-4 rounded-2xl transition-all duration-200 flex flex-col gap-3 shadow-md"
            >
              {editingIdx === idx ? (
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-xl bg-slate-900 border border-amber-500/40 p-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
                />
              ) : (
                <p className="text-sm text-slate-200 leading-relaxed font-medium">
                  «{wish}»
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/60 flex-wrap">
                {editingIdx === idx ? (
                  <>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                    >
                      Отмена
                    </button>
                    <button
                      type="button"
                      onClick={saveEdit}
                      className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Check size={14} />
                      <span>Сохранить</span>
                    </button>
                  </>
                ) : (
                  <>
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
                      onClick={() => startEdit(idx)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Pencil size={14} />
                      <span>Изменить</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => applyWish(wish)}
                      className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-transform hover:scale-105 shadow-md shadow-amber-500/20"
                    >
                      <Check size={14} />
                      <span>Вставить в коллаж</span>
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Custom wish composer */}
        <div className="bg-slate-950/70 border border-amber-500/30 rounded-2xl p-4 flex flex-col gap-3 shadow-md">
          <div className="flex items-center gap-2 text-amber-200 text-sm font-bold">
            <Plus size={16} />
            <span>Своё поздравление</span>
          </div>
          <textarea
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            rows={3}
            placeholder="Напишите своё пожелание..."
            className="w-full resize-none rounded-xl bg-slate-900 border border-amber-500/40 p-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
          />
          <button
            type="button"
            onClick={addCustom}
            disabled={!custom.trim()}
            className="self-end px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-transform hover:scale-105 shadow-md shadow-amber-500/20"
          >
            <Plus size={14} />
            <span>Добавить в коллаж</span>
          </button>
        </div>
      </div>
    </div>
  );
};
