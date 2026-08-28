import React, { useState, useRef } from 'react';
import { StickerItem } from '../types';
import { X, RotateCw, Plus, Minus } from 'lucide-react';

interface StickerElementProps {
  sticker: StickerItem;
  isSelected: boolean;
  onSelect: () => void;
  onUpdate: (updated: Partial<StickerItem>) => void;
  onRemove: () => void;
}

export const StickerElement: React.FC<StickerElementProps> = ({
  sticker,
  isSelected,
  onSelect,
  onUpdate,
  onRemove,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: sticker.x,
      initialY: sticker.y,
    };
    // Capture on the element that owns the move/up handlers (currentTarget),
    // NOT on e.target (the inner emoji/badge child), otherwise move events
    // are routed to the child and dragging silently fails.
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    // Measure against the positioned canvas layer (offsetParent), not the
    // zero-size pointer-events wrapper that directly parents this element.
    const parent = (e.currentTarget as HTMLElement).offsetParent as HTMLElement | null;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStartRef.current.startX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStartRef.current.startY) / rect.height) * 100;

    const newX = Math.max(0, Math.min(100, dragStartRef.current.initialX + deltaX));
    const newY = Math.max(0, Math.min(100, dragStartRef.current.initialY + deltaY));

    onUpdate({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }
  };

  const rotateMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ rotation: (sticker.rotation + 15) % 360 });
  };

  const scaleUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ size: Math.min(120, sticker.size + 8) });
  };

  const scaleDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ size: Math.max(16, sticker.size - 8) });
  };

  return (
    <div
      id={`sticker-${sticker.id}`}
      style={{
        left: `${sticker.x}%`,
        top: `${sticker.y}%`,
        transform: `translate(-50%, -50%) rotate(${sticker.rotation}deg)`,
        zIndex: sticker.zIndex + (isSelected ? 50 : 0),
        touchAction: 'none',
      }}
      className={`absolute cursor-move select-none transition-shadow ${
        isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 rounded-lg' : ''
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={(e) => e.stopPropagation()}
    >
      {sticker.type === 'badge' ? (
        <div
          className="px-3 py-1 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-slate-950 font-black tracking-wider uppercase rounded-full shadow-xl border-2 border-white flex items-center gap-1.5 whitespace-nowrap"
          style={{ fontSize: `${sticker.size}px` }}
        >
          {sticker.content}
        </div>
      ) : (
        <div
          className="filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] transition-transform hover:scale-105"
          style={{ fontSize: `${sticker.size}px`, lineHeight: 1 }}
        >
          {sticker.content}
        </div>
      )}

      {/* Floating mini-controls when selected */}
      {isSelected && (
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-slate-950/90 text-white px-2 py-1 rounded-full border border-amber-500/50 shadow-2xl backdrop-blur-md z-50 pointer-events-auto"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={scaleDown}
            className="p-1 hover:bg-white/20 rounded-full"
            title="Уменьшить"
          >
            <Minus size={12} />
          </button>
          <button
            type="button"
            onClick={scaleUp}
            className="p-1 hover:bg-white/20 rounded-full"
            title="Увеличить"
          >
            <Plus size={12} />
          </button>
          <button
            type="button"
            onClick={rotateMore}
            className="p-1 hover:bg-white/20 rounded-full text-amber-300"
            title="Повернуть"
          >
            <RotateCw size={12} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="p-1 hover:bg-red-500/80 rounded-full text-red-300"
            title="Удалить"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </div>
  );
};
