import { CollageTheme, BackgroundStyle, StickerItem } from '../types';

export const THEMES: CollageTheme[] = [
  {
    id: 'mosaic-hero',
    name: 'Главный Герой',
    icon: 'Crown',
    description: 'Большое центральное фото в окружении ярких праздничных моментов',
    defaultBg: 'dark-gold',
    frameStyle: 'gold-border',
  },
  {
    id: 'scrapbook',
    name: 'Полароид-альбом',
    icon: 'Sparkles',
    description: 'Живые снимки с праздничным скотчем, булавками и тёплыми надписями',
    defaultBg: 'festive-confetti',
    frameStyle: 'polaroid',
  },
  {
    id: 'magazine',
    name: 'Обложка Журнала',
    icon: 'Flame',
    description: 'Стильный постер на обложке: «Человек года», «Суперзвезда»',
    defaultBg: 'neon-party',
    frameStyle: 'glass',
  },
  {
    id: 'festive-grid',
    name: 'Золотой Праздник',
    icon: 'PartyPopper',
    description: 'Симметричный премиум-коллаж с золотыми акцентами и гирляндами',
    defaultBg: 'dark-gold',
    frameStyle: 'gold-border',
  },
  {
    id: 'comic-fun',
    name: 'Драйв & Веселье',
    icon: 'Zap',
    description: 'Яркий, энергичный стиль с прикольными стикерами и взрывными эффектами',
    defaultBg: 'gradient-sunset',
    frameStyle: 'comic',
  },
  {
    id: 'polaroid-wall',
    name: 'Стена Воспоминаний',
    icon: 'Image',
    description: 'Гирлянда с огоньками и развешанными фото-карточками',
    defaultBg: 'blue-sparkles',
    frameStyle: 'polaroid',
  },
  {
    id: 'free',
    name: 'Свободное размещение',
    icon: 'Move',
    description: 'Расставьте фото вручную: перетаскивайте, вращайте и масштабируйте прямо на холсте',
    defaultBg: 'dark-gold',
    frameStyle: 'gold-border',
  },
];

export const BACKGROUNDS: { id: BackgroundStyle; name: string; class: string; preview: string }[] = [
  {
    id: 'dark-gold',
    name: 'Золотая Ночь',
    class: 'bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/70 border border-amber-500/20',
    preview: 'linear-gradient(135deg, #090d16, #1a150b, #332104)',
  },
  {
    id: 'festive-confetti',
    name: 'Конфетти Карнавал',
    class: 'bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950/80',
    preview: 'linear-gradient(135deg, #1e1b4b, #3b0764, #500724)',
  },
  {
    id: 'blue-sparkles',
    name: 'Космический Синий',
    class: 'bg-gradient-to-br from-sky-950 via-blue-950 to-indigo-950',
    preview: 'linear-gradient(135deg, #082f49, #172554, #1e1b4b)',
  },
  {
    id: 'neon-party',
    name: 'Неон & Драйв',
    class: 'bg-gradient-to-br from-fuchsia-950 via-slate-950 to-cyan-950',
    preview: 'linear-gradient(135deg, #4a044e, #020617, #083344)',
  },
  {
    id: 'gradient-sunset',
    name: 'Солнечный Закат',
    class: 'bg-gradient-to-br from-amber-900 via-rose-900 to-orange-950',
    preview: 'linear-gradient(135deg, #78350f, #4c0519, #431407)',
  },
  {
    id: 'cozy-wood',
    name: 'Уютный Лофт',
    class: 'bg-gradient-to-br from-stone-900 via-neutral-900 to-zinc-950',
    preview: 'linear-gradient(135deg, #1c1917, #262626, #09090b)',
  },
  {
    id: 'warm-sunshine',
    name: 'Яркий Праздник',
    class: 'bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 bg-slate-900',
    preview: 'linear-gradient(135deg, #b45309, #c2410c, #b91c1c)',
  },
];

export const STICKER_PACK = [
  // Emojis & Badges
  { category: 'Праздник', items: ['🎂', '🎈', '🎉', '🎁', '👑', '🥳', '✨', '⭐', '🎆', '🍾', '🍰', '🧁'] },
  { category: 'Крутые', items: ['🕶️', '🚀', '🔥', '⚡', '🏆', '🍕', '🎮', '🛹', '🎸', '⚽', '🎯', '💯'] },
  { category: 'Эмоции & Любовь', items: ['❤️', '💥', '✌️', '💪', '🦁', '🌟', '🤩', '🤙', '😎', '🙌', '💖', '💎'] },
  { 
    category: 'Надписи', 
    badges: [
      { text: 'СУПЕРГЕРОЙ ДНЯ 🦸‍♂️', bg: 'bg-red-600 text-white' },
      { text: 'САМЫЙ КРУТОЙ ПАРЕНЬ 😎', bg: 'bg-amber-500 text-slate-950' },
      { text: 'ЧЕМПИОН 🏆', bg: 'bg-emerald-600 text-white' },
      { text: 'MAX POWER ⚡', bg: 'bg-purple-600 text-white' },
      { text: '100% ВЕСЕЛЬЯ 🎉', bg: 'bg-pink-600 text-white' },
      { text: 'ГЛАВНЫЙ ИМЕНИННИК 👑', bg: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black' },
      { text: 'УРА, ДНЮХА! 🎂', bg: 'bg-cyan-600 text-white' },
      { text: 'БОЛЬШОЙ БОСС 👔', bg: 'bg-blue-600 text-white' }
    ] 
  }
];

export const BIRTHDAY_WISHES = [
  "Пусть каждый твой день будет полон крутых приключений, верных друзей и ярких побед!",
  "С днем рождения! Желаем море позитива, исполнения самых заветных желаний, космических успехов в учебе и хобби!",
  "В день рождения — гору подарков, вкусного торта, веселья без границ и самых незабываемых моментов!",
  "Ты наш главный чемпион и супергерой! Пусть жизнь дарит улыбки, крутые впечатления и бесконечную радость!",
  "Желаем открывать новые горизонты, верить в свои мечты и всегда оставаться таким же искренним, задорным и классным!"
];

export const INITIAL_STICKERS: StickerItem[] = [
  { id: 'stk-1', type: 'emoji', content: '👑', x: 50, y: 3, size: 48, rotation: -8, zIndex: 30 },
  { id: 'stk-2', type: 'emoji', content: '🎈', x: 8, y: 6, size: 52, rotation: -15, zIndex: 25 },
  { id: 'stk-3', type: 'emoji', content: '🎉', x: 91, y: 7, size: 50, rotation: 18, zIndex: 25 },
  { id: 'stk-4', type: 'badge', content: 'ГЛАВНЫЙ ИМЕНИННИК 👑', x: 50, y: 92, size: 18, rotation: 0, zIndex: 35 },
  { id: 'stk-5', type: 'emoji', content: '⭐', x: 14, y: 88, size: 36, rotation: 20, zIndex: 20 },
  { id: 'stk-6', type: 'emoji', content: '🎂', x: 86, y: 88, size: 44, rotation: -12, zIndex: 20 },
];
