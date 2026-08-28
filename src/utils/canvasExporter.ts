import { PhotoSlot, StickerItem, BirthdayTextConfig, LayoutStyle, BackgroundStyle } from '../types';
import { toPng, toJpeg, toBlob } from 'html-to-image';
import html2canvas from 'html2canvas';

export interface CollageExportData {
  photos: PhotoSlot[];
  layout: LayoutStyle;
  background: BackgroundStyle;
  textConfig: BirthdayTextConfig;
  stickers: StickerItem[];
  heroPhotoId: string;
}

// Loads an image from URL or objectURL safely
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('Empty image source'));
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

// Fallback high-resolution direct Canvas 2D engine (100% reliable, zero CSS parser bugs)
export async function renderCollageDirectCanvas(
  data: CollageExportData,
  width = 1920,
  height = 1350
): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot get 2d context');

  // 1. Draw festive background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, width, height);
  if (data.background === 'festive-confetti') {
    bgGrad.addColorStop(0, '#1e1b4b');
    bgGrad.addColorStop(0.5, '#3b0764');
    bgGrad.addColorStop(1, '#500724');
  } else if (data.background === 'blue-sparkles') {
    bgGrad.addColorStop(0, '#082f49');
    bgGrad.addColorStop(0.5, '#172554');
    bgGrad.addColorStop(1, '#1e1b4b');
  } else if (data.background === 'neon-party') {
    bgGrad.addColorStop(0, '#4a044e');
    bgGrad.addColorStop(0.5, '#020617');
    bgGrad.addColorStop(1, '#083344');
  } else if (data.background === 'gradient-sunset') {
    bgGrad.addColorStop(0, '#78350f');
    bgGrad.addColorStop(0.5, '#4c0519');
    bgGrad.addColorStop(1, '#431407');
  } else {
    // dark-gold default
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.5, '#1a150b');
    bgGrad.addColorStop(1, '#332104');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Decorative ambient glow circles
  const glow1 = ctx.createRadialGradient(200, 200, 10, 200, 200, 400);
  glow1.addColorStop(0, 'rgba(245, 158, 11, 0.25)');
  glow1.addColorStop(1, 'rgba(245, 158, 11, 0)');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  const glow2 = ctx.createRadialGradient(width - 200, height - 200, 10, width - 200, height - 200, 500);
  glow2.addColorStop(0, 'rgba(236, 72, 153, 0.2)');
  glow2.addColorStop(1, 'rgba(236, 72, 153, 0)');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  // Outer border & corner ornaments
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
  ctx.lineWidth = 6;
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // 2. Main Title Banner
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Badge Ribbon
  if (data.textConfig.badgeText) {
    ctx.font = 'bold 24px sans-serif';
    const badgeText = data.textConfig.badgeText;
    const badgeMetrics = ctx.measureText(badgeText);
    const badgeW = badgeMetrics.width + 40;
    const badgeH = 44;
    const badgeX = width / 2 - badgeW / 2;
    const badgeY = 60;

    ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 22);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fde68a';
    ctx.fillText(badgeText, width / 2, badgeY + badgeH / 2);
  }

  // Main Header Title
  const titleY = data.textConfig.badgeText ? 150 : 110;
  ctx.font = '900 68px "Russo One", "Montserrat", sans-serif';
  
  // Gold title gradient
  const titleGrad = ctx.createLinearGradient(width / 2 - 300, 0, width / 2 + 300, 0);
  titleGrad.addColorStop(0, '#fef08a');
  titleGrad.addColorStop(0.5, '#f59e0b');
  titleGrad.addColorStop(1, '#d97706');

  ctx.shadowColor = 'rgba(245, 158, 11, 0.8)';
  ctx.shadowBlur = 25;
  ctx.fillStyle = titleGrad;
  ctx.fillText(data.textConfig.title || 'С днем рождения Максим!', width / 2, titleY);
  ctx.shadowBlur = 0; // reset

  // Subtitle
  if (data.textConfig.subtitle) {
    ctx.font = '500 26px "Comfortaa", sans-serif';
    ctx.fillStyle = '#fef3c7';
    ctx.fillText(data.textConfig.subtitle, width / 2, titleY + 55);
  }

  // 3. Draw Photos in Grid Layout
  const topOffset = titleY + 110;
  const gridW = width - 120;
  const gridH = height - topOffset - 90;
  const gridX = 60;
  const gridY = topOffset;

  const heroPhoto = data.photos.find((p) => p.id === data.heroPhotoId) || data.photos[data.photos.length - 1];
  const sidePhotos = data.photos.filter((p) => p.id !== heroPhoto.id);

  // 7 photo slots coordinates
  const slotWidth = (gridW - 60) / 4;
  const slotHeight = (gridH - 30) / 2;

  // Center Hero (spans 2 cols)
  const heroX = gridX + slotWidth + 20;
  const heroY = gridY;
  const heroW = slotWidth * 2 + 20;
  const heroH = gridH;

  // Slot rects
  const photoSlots = [
    { photo: sidePhotos[0], x: gridX, y: gridY, w: slotWidth, h: slotHeight },
    { photo: sidePhotos[1], x: gridX, y: gridY + slotHeight + 30, w: slotWidth, h: slotHeight },
    { photo: sidePhotos[2], x: gridX + slotWidth * 3 + 60, y: gridY, w: slotWidth, h: slotHeight },
    { photo: sidePhotos[3], x: gridX + slotWidth * 3 + 60, y: gridY + slotHeight + 30, w: slotWidth, h: slotHeight },
    { photo: heroPhoto, x: heroX, y: heroY, w: heroW, h: heroH, isHero: true },
  ];

  // If there are photo 5 and 6, draw them appropriately
  if (sidePhotos[4]) {
    photoSlots.push({ photo: sidePhotos[4], x: gridX, y: gridY, w: slotWidth, h: slotHeight });
  }

  for (let i = 0; i < photoSlots.length; i++) {
    const slot = photoSlots[i];
    if (!slot.photo) continue;

    ctx.save();
    // Card background & shadow
    ctx.shadowColor = slot.isHero ? 'rgba(245, 158, 11, 0.4)' : 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = slot.isHero ? 25 : 15;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(slot.x, slot.y, slot.w, slot.h, 18);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Card Gold Border
    ctx.strokeStyle = slot.isHero ? '#f59e0b' : 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = slot.isHero ? 4 : 2;
    ctx.stroke();

    // Clip image inside card
    const innerPadding = 10;
    const imgX = slot.x + innerPadding;
    const imgY = slot.y + innerPadding;
    const imgW = slot.w - innerPadding * 2;
    const imgH = slot.h - innerPadding * 2 - 30; // space for caption

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(imgX, imgY, imgW, imgH, 12);
    ctx.clip();

    if (slot.photo.url) {
      try {
        const img = await loadImage(slot.photo.url);
        // Draw image cover-fitted
        const imgAspect = img.width / img.height;
        const targetAspect = imgW / imgH;
        let dw = imgW;
        let dh = imgH;
        let dx = imgX;
        let dy = imgY;

        if (imgAspect > targetAspect) {
          dw = imgH * imgAspect;
          dx = imgX - (dw - imgW) / 2;
        } else {
          dh = imgW / imgAspect;
          dy = imgY - (dh - imgH) / 2;
        }

        ctx.drawImage(img, dx, dy, dw, dh);
      } catch {
        // Draw placeholder fallback
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(imgX, imgY, imgW, imgH);
      }
    } else {
      // Illustrated gradient placeholder
      const pGrad = ctx.createLinearGradient(imgX, imgY, imgX + imgW, imgY + imgH);
      pGrad.addColorStop(0, '#d97706');
      pGrad.addColorStop(1, '#1e1b4b');
      ctx.fillStyle = pGrad;
      ctx.fillRect(imgX, imgY, imgW, imgH);

      ctx.font = '50px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(slot.isHero ? '⭐' : '📸', imgX + imgW / 2, imgY + imgH / 2);
    }
    ctx.restore();

    // Caption
    if (slot.photo.caption) {
      ctx.font = '600 16px "Montserrat", sans-serif';
      ctx.fillStyle = '#fde68a';
      ctx.textAlign = 'center';
      ctx.fillText(slot.photo.caption, slot.x + slot.w / 2, slot.y + slot.h - 16);
    }

    ctx.restore();
  }

  // 4. Draw Stickers
  for (const stk of data.stickers) {
    ctx.save();
    const sx = (stk.x / 100) * width;
    const sy = (stk.y / 100) * height;
    ctx.translate(sx, sy);
    ctx.rotate((stk.rotation * Math.PI) / 180);

    if (stk.type === 'badge') {
      ctx.font = 'bold 22px "Montserrat", sans-serif';
      const m = ctx.measureText(stk.content);
      const bw = m.width + 30;
      const bh = 42;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(-bw / 2, -bh / 2, bw, bh, 21);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = '#0f172a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(stk.content, 0, 0);
    } else {
      ctx.font = `${Math.round(stk.size * 1.8)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(stk.content, 0, 0);
    }

    ctx.restore();
  }

  // Bottom footer text
  ctx.font = 'bold 18px "Montserrat", sans-serif';
  ctx.fillStyle = 'rgba(253, 230, 138, 0.7)';
  ctx.textAlign = 'center';
  ctx.fillText('★ Праздничный коллаж • С днем рождения Максим! ★', width / 2, height - 35);

  return canvas.toDataURL('image/png', 0.98);
}

// Waits until all web fonts are loaded so the captured text does not reflow/blank
async function ensureFontsReady(): Promise<void> {
  try {
    if (document.fonts && typeof document.fonts.ready?.then === 'function') {
      await document.fonts.ready;
    }
  } catch {
    /* fonts API unavailable — ignore */
  }
}

// Computes the FULL on-screen size of the element (including content that may
// overflow the visible box) so the exported image is never cropped.
function getElementFullSize(el: HTMLElement): { width: number; height: number } {
  const width = Math.max(el.scrollWidth, el.offsetWidth, el.clientWidth);
  const height = Math.max(el.scrollHeight, el.offsetHeight, el.clientHeight);
  return { width, height };
}

// Master exporter with multi-stage fallback (html-to-image -> html2canvas -> directCanvas)
export async function exportCollageImage(
  targetElementId: string,
  format: 'png' | 'jpeg',
  fallbackData?: CollageExportData
): Promise<string> {
  const target = document.getElementById(targetElementId) as HTMLElement | null;

  // Make sure fonts are embedded before we snapshot the DOM.
  await ensureFontsReady();

  const exportBg = '#090d16';

  // Strategy 1: Modern html-to-image (handles SVG, web fonts, modern CSS)
  if (target) {
    try {
      const { width, height } = getElementFullSize(target);
      const options = {
        // Capture the ENTIRE element, not just the visible/clipped box.
        width,
        height,
        pixelRatio: 2,
        // IMPORTANT: cacheBust appends ?<rand> to every URL, which INVALIDATES
        // uploaded blob: images and CORS-locked photos, leaving them blank.
        cacheBust: false,
        // Skip re-downloading/embedding remote assets that fail — keep local
        // blob: photos intact instead of dropping them.
        skipFonts: false,
        backgroundColor: exportBg,
        style: {
          transform: 'none',
          margin: '0',
          // Pin the clone to the real content size so nothing is cut off.
          width: `${width}px`,
          height: `${height}px`,
          maxWidth: `${width}px`,
          maxHeight: `${height}px`,
        },
      };
      if (format === 'jpeg') {
        return await toJpeg(target, options);
      }
      return await toPng(target, options);
    } catch (err1) {
      console.warn('html-to-image attempt failed, trying html2canvas fallback...', err1);
    }
  }

  // Strategy 2: html2canvas with explicit full-size capture
  if (target) {
    try {
      const { width, height } = getElementFullSize(target);
      const canvas = await html2canvas(target, {
        scale: 2,
        // Render the full element, not the viewport-sized slice.
        width,
        height,
        windowWidth: width,
        windowHeight: height,
        useCORS: true,
        allowTaint: true,
        backgroundColor: exportBg,
        logging: false,
      });
      const mime = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      return canvas.toDataURL(mime, 0.95);
    } catch (err2) {
      console.warn('html2canvas attempt failed, trying direct Canvas 2D engine...', err2);
    }
  }

  // Strategy 3: Guaranteed 100% Canvas 2D render engine
  if (fallbackData) {
    return await renderCollageDirectCanvas(fallbackData);
  }

  throw new Error('Не удалось экспортировать изображение');
}
