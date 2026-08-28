export interface PhotoSlot {
  id: string;
  url: string;
  caption?: string;
  zoom: number; // 1 to 3
  rotation: number; // -180 to 180
  offsetX: number;
  offsetY: number;
  filter: 'none' | 'vivid' | 'warm' | 'vintage' | 'bw' | 'festive' | 'soft';
}

export interface StickerItem {
  id: string;
  type: 'emoji' | 'badge' | 'ribbon' | 'decor' | 'hat' | 'cake';
  content: string; // emoji or svg/icon name or text
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number; // in px or scale
  rotation: number;
  zIndex: number;
}

export interface BirthdayTextConfig {
  title: string;
  subtitle: string;
  fontFamily: string;
  titleColor: string;
  titleGradient: string; // CSS gradient or single color
  subtitleColor: string;
  size: 'small' | 'medium' | 'large' | 'huge';
  effect: 'glow' | 'shadow' | 'gold' | 'neon' | '3d' | 'flat';
  align: 'center' | 'left' | 'right';
  badgeText: string;
  footerLeft: string;
  footerRight: string;
}

export type LayoutStyle = 
  | 'scrapbook'     // Polaroid scrapbook with festive tapes, clips & pins
  | 'festive-grid'  // Modern golden luxury framed grid
  | 'magazine'      // Trendy magazine cover with Maxim as the star
  | 'comic-fun'     // Fun pop-art celebration style with badges
  | 'mosaic-hero'   // Big central hero photo + 6 surrounding festive vignettes
  | 'polaroid-wall'; // Tilted polaroids on a celebratory backdrop

export type BackgroundStyle = 
  | 'dark-gold'
  | 'festive-confetti'
  | 'blue-sparkles'
  | 'warm-sunshine'
  | 'neon-party'
  | 'cozy-wood'
  | 'gradient-sunset'
  | 'white-minimal';

export interface CollageTheme {
  id: LayoutStyle;
  name: string;
  icon: string;
  description: string;
  defaultBg: BackgroundStyle;
  frameStyle: 'polaroid' | 'gold-border' | 'neon-glow' | 'comic' | 'clean-round' | 'glass';
}
