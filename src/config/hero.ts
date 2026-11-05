export interface HeroScene {
  id: string;
  startProgress: number;
  endProgress: number;
  headline: string;
  subheadline: string;
  badge: string;
  activeTabSuggestion: 'flights' | 'hotels' | 'paylater';
  actionCta?: {
    label: string;
    action: string;
  };
}

export interface HeroConfig {
  desktop: {
    frameCount: number;
    framePath: (index: number) => string;
    posterPath: string;
  };
  mobile: {
    frameCount: number;
    framePath: (index: number) => string;
    posterPath: string;
  };
  scenes: HeroScene[];
}

export const HERO_CONFIG: HeroConfig = {
  desktop: {
    frameCount: 96,
    framePath: (index: number) => {
      const padded = String(Math.max(1, Math.min(96, index))).padStart(3, '0');
      return `/hero/desktop/f_${padded}.webp`;
    },
    posterPath: '/hero/desktop/f_001.webp',
  },
  mobile: {
    frameCount: 48,
    framePath: (index: number) => {
      const padded = String(Math.max(1, Math.min(48, index))).padStart(3, '0');
      return `/hero/mobile/f_${padded}.webp`;
    },
    posterPath: '/hero/mobile/f_001.webp',
  },
  scenes: [
    {
      id: 'scene-dawn',
      startProgress: 0.0,
      endProgress: 0.28,
      badge: 'FLIGHT 01 · DAWN RUNWAY',
      headline: 'DAWN DEPARTURES',
      subheadline: 'Direct connections across the continent and beyond. Experience precision flight booking.',
      activeTabSuggestion: 'flights',
    },
    {
      id: 'scene-climb',
      startProgress: 0.28,
      endProgress: 0.58,
      badge: 'FLIGHT 02 · CRUISE LEVEL',
      headline: 'ABOVE THE HORIZON',
      subheadline: 'Book flights in real time. Transparent fares, guaranteed seat reservations, zero hidden charges.',
      activeTabSuggestion: 'flights',
    },
    {
      id: 'scene-city',
      startProgress: 0.58,
      endProgress: 0.86,
      badge: 'EXPEDITION 03 · COASTAL ARRIVAL',
      headline: 'SANCTUARY FOUND',
      subheadline: 'Bespoke hotel reservations automatically synchronized with your arrival gate and itinerary.',
      activeTabSuggestion: 'hotels',
    },
    {
      id: 'scene-lobby',
      startProgress: 0.86,
      endProgress: 1.0,
      badge: 'FINANCE 04 · LOBBY WELCOME',
      headline: 'FLY NOW, PAY LATER',
      subheadline: 'Travel without compromise. Instant loan decisions, transparent APR, and zero penalty for early repayment.',
      activeTabSuggestion: 'paylater',
      actionCta: {
        label: 'Calculate Loan & Apply',
        action: 'open-paylater',
      },
    },
  ],
};
