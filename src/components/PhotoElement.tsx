import React, { useRef, useState } from 'react';
import { PhotoSlot, LayoutStyle } from '../types';
import { PhotoCard } from './PhotoCard';
import { RotateCw, RotateCcw, Plus, Minus, Edit3, Star, Layers } from 'lucide-react';

interface PhotoElementProps {
  photo: PhotoSlot;
  isSelected: boolean;
  isHero: boolean;
  onSelect: () => void;
  onUpdate: (updated: Partial<PhotoSlot>) => void;
  onEdit: (photo: PhotoSlot) => void;
  onSetHero: (id: string) => void;
  onBringToFront: (id: string) => void;
}

const BASE_WIDTH = 32; // % of canvas at scale 1

export const PhotoElement: React.FC<PhotoElementProps> = ({
  photo,
  isSelected,
  isHero,
  onSelect,
  onUpdate,
  onEdit,
  onSetHero,
  onBringToFront,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: 50,
    initialY: 50,
  });

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    onSelect();
    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: photo.x ?? 50,
      initialY: photo.y ?? 50,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const parent = (e.currentTarget as HTMLElement).parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStartRef.current.startX) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStartRef.current.startY) / rect.height) * 100;
    const newX = Math.max(2, Math.min(98, dragStartRef.current.initialX + deltaX));
    const newY = Math.max(2, Math.min(98, dragStartRef.current.initialY + deltaY));
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

  const rotate = (deg: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ rotation: (((photo.rotation + deg) % 360) + 360) % 360 });
  };

  const changeScale = (delta: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ scale: Math.max(0.4, Math.min(2.5, (photo.scale ?? 1) + delta)) });
  };

  const scale = photo.scale ?? 1;

  return (
    <div
      id={`photo-element-${photo.id}`}
      style={{
        left: `${photo.x ?? 50}%`,
        top: `${photo.y ?? 50}%`,
        width: `${BASE_WIDTH * scale}%`,
        transform: `translate(-50%, -50%) rotate(${photo.rotation}deg)`,
        zIndex: (photo.zIndex ?? 10) + (isSelected ? 50 : 0),
        touchAction: 'none',
      }}
      className={`absolute cursor-move select-none pointer-events-auto transition-shadow ${
        isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 rounded-2xl' : ''
      } ${isHero ? 'ring-2 ring-amber-300/70 rounded-2xl' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={(e) => e.stopPropagation()}
    >
      <PhotoCard
        photo={photo}
        index={0}
        layout={'free' as LayoutStyle}
        isHero={isHero}
        onEdit={onEdit}
        onUpload={() => {}}
        onSwap={() => {}}
      />

      {/* Floating mini-controls when selected */}
      {isSelected && (
        <div
          className="absolute -top-11 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-slate-950/90 text-white px-2 py-1 rounded-full border border-amber-500/50 shadow-2xl backdrop-blur-md z-50 pointer-events-auto"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <button type="button" onClick={rotate(-15)} className="p-1 hover:bg-white/20 rounded-full" title="Повернуть влево">
            <RotateCcw size={13} />
          </button>
          <button type="button" onClick={rotate(15)} className="p-1 hover:bg-white/20 rounded-full text-amber-300" title="Повернуть вправо">
            <RotateCw size={13} />
          </button>
          <span className="w-px h-4 bg-white/20 mx-0.5" />
          <button type="button" onClick={changeScale(-0.1)} className="p-1 hover:bg-white/20 rounded-full" title="Уменьшить">
            <Minus size={13} />
          </button>
          <button type="button" onClick={changeScale(0.1)} className="p-1 hover:bg-white/20 rounded-full" title="Увеличить">
            <Plus size={13} />
          </button>
          <span className="w-px h-4 bg-white/20 mx-0.5" />
          <button type="button" onClick={(e) => { e.stopPropagation(); onEdit(photo); }} className="p-1 hover:bg-white/20 rounded-full text-sky-300" title="Редактировать">
            <Edit3 size={13} />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onSetHero(photo.id); }} className={`p-1 hover:bg-white/20 rounded-full ${isHero ? 'text-amber-300' : ''}`} title="Сделать главным">
            <Star size={13} />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onBringToFront(photo.id); }} className="p-1 hover:bg-white/20 rounded-full text-emerald-300" title="На передний план">
            <Layers size={13} />
          </button>
        </div>
      )}
    </div>
  );
};
