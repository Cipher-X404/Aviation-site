/**
 * Curated image assets with high-fidelity teal duotone SVG fallbacks.
 * Guaranteed zero broken images across all rendering environments.
 */

// Helper to render an evocative duotone architectural asset fallback
function createTealDuotoneSvg(title: string, subtitle: string, code: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <defs>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0E2931"/>
        <stop offset="50%" stop-color="#12484C"/>
        <stop offset="100%" stop-color="#0D5C75"/>
      </linearGradient>
      <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#F2B632" stop-opacity="0.8"/>
        <stop offset="100%" stop-color="#F2B632" stop-opacity="0.2"/>
      </linearGradient>
      <pattern id="contour" width="80" height="80" patternUnits="userSpaceOnUse">
        <path d="M 0 20 Q 20 5, 40 20 T 80 20" stroke="rgba(165, 209, 225, 0.08)" fill="none" stroke-width="1.5"/>
        <path d="M 0 50 Q 20 35, 40 50 T 80 50" stroke="rgba(165, 209, 225, 0.08)" fill="none" stroke-width="1.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#skyGrad)"/>
    <rect width="100%" height="100%" fill="url(#contour)"/>
    <!-- Subtle mountain / skyline silhouette -->
    <path d="M 0 380 L 120 320 L 250 360 L 400 290 L 580 370 L 720 310 L 800 350 L 800 500 L 0 500 Z" fill="#091A20" opacity="0.6"/>
    <path d="M 0 420 L 180 370 L 340 410 L 520 350 L 680 400 L 800 370 L 800 500 L 0 500 Z" fill="#061216" opacity="0.8"/>
    <!-- Code watermark -->
    <text x="750" y="80" font-family="'JetBrains Mono', monospace" font-size="32" font-weight="700" fill="#F2B632" opacity="0.3" text-anchor="end">${code}</text>
    <!-- Card title & subtitle -->
    <text x="40" y="420" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="28" font-weight="700" fill="#F4F6F5" letter-spacing="1">${title}</text>
    <text x="40" y="450" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="14" font-weight="500" fill="#A5D1E1" opacity="0.85">${subtitle}</text>
  </svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export interface ImageAsset {
  src: string;
  fallback: string;
  alt: string;
  aspectRatio: string;
}

export const DESTINATION_IMAGES: Record<string, ImageAsset> = {
  LOS: {
    src: '/images/destinations/lagos.jpg',
    fallback: createTealDuotoneSvg('LAGOS', 'Coastal Metropolis · Atlantic Shoreline', 'LOS'),
    alt: 'Lagos coastal shoreline and city skyline',
    aspectRatio: '16:9',
  },
  ABV: {
    src: '/images/destinations/abuja.jpg',
    fallback: createTealDuotoneSvg('ABUJA', 'Federal Capital · Granitic Monoliths', 'ABV'),
    alt: 'Abuja central district with rock silhouettes',
    aspectRatio: '16:9',
  },
  PHC: {
    src: '/images/destinations/portharcourt.jpg',
    fallback: createTealDuotoneSvg('PORT HARCOURT', 'Garden City · Riverine Delta', 'PHC'),
    alt: 'Port Harcourt delta riverfront and lush scenery',
    aspectRatio: '16:9',
  },
  ACC: {
    src: '/images/destinations/accra.jpg',
    fallback: createTealDuotoneSvg('ACCRA', 'Gold Coast · Vibrant Atlantic Bay', 'ACC'),
    alt: 'Accra coastline and architectural resort district',
    aspectRatio: '16:9',
  },
  NBO: {
    src: '/images/destinations/nairobi.jpg',
    fallback: createTealDuotoneSvg('NAIROBI', 'Safari Capital · Highland Skyline', 'NBO'),
    alt: 'Nairobi national park and city backdrop',
    aspectRatio: '16:9',
  },
  DXB: {
    src: '/images/destinations/dubai.jpg',
    fallback: createTealDuotoneSvg('DUBAI', 'Desert Oasis · Futuristic Architecture', 'DXB'),
    alt: 'Dubai skyline and golden hour waterfront',
    aspectRatio: '16:9',
  },
  LHR: {
    src: '/images/destinations/london.jpg',
    fallback: createTealDuotoneSvg('LONDON', 'Royal Metropolis · Thames Basin', 'LHR'),
    alt: 'London classic architecture and historic riverline',
    aspectRatio: '16:9',
  },
  JNB: {
    src: '/images/destinations/johannesburg.jpg',
    fallback: createTealDuotoneSvg('JOHANNESBURG', 'City of Gold · Highveld Panorama', 'JNB'),
    alt: 'Johannesburg skyline and Sandton skyline',
    aspectRatio: '16:9',
  },
};

export const HOTEL_IMAGES: Record<string, ImageAsset> = {
  'hotel-eko-grand': {
    src: '/images/hotels/eko-grand.jpg',
    fallback: createTealDuotoneSvg('THE EKO GRAND OASIS', 'Victoria Island, Lagos · 5-Star Oceanfront', 'LOS-HTL'),
    alt: 'Luxury bedroom with floor-to-ceiling Atlantic Ocean views',
    aspectRatio: '16:9',
  },
  'hotel-transcorp-meridian': {
    src: '/images/hotels/transcorp-meridian.jpg',
    fallback: createTealDuotoneSvg('TRANSCORP ROYAL MERIDIAN', 'Central Business District, Abuja', 'ABV-HTL'),
    alt: 'Presidential suite with marble bathroom and terrace',
    aspectRatio: '16:9',
  },
  'hotel-burj-zafaran': {
    src: '/images/hotels/burj-zafaran.jpg',
    fallback: createTealDuotoneSvg('BURJ AL-ZAFARAN', 'Downtown Dubai · Canal Promenade', 'DXB-HTL'),
    alt: 'Private rooftop infinity pool overlooking skyline',
    aspectRatio: '16:9',
  },
  'hotel-saxon-crest': {
    src: '/images/hotels/saxon-crest.jpg',
    fallback: createTealDuotoneSvg('THE SAXON CREST', 'Sandhurst, Johannesburg · Private Estate', 'JNB-HTL'),
    alt: 'Estate gardens and tranquil luxury villa',
    aspectRatio: '16:9',
  },
  'hotel-mayfair-colony': {
    src: '/images/hotels/mayfair-colony.jpg',
    fallback: createTealDuotoneSvg('THE MAYFAIR COLONY', 'Mayfair, London · Heritage Suites', 'LHR-HTL'),
    alt: 'Classic British luxury lounge with fireplace',
    aspectRatio: '16:9',
  },
  'hotel-norfolk-sanctuary': {
    src: '/images/hotels/norfolk-sanctuary.jpg',
    fallback: createTealDuotoneSvg('NORFOLK SANCTUARY', 'Upper Hill, Nairobi · Garden Suites', 'NBO-HTL'),
    alt: 'Veranda overlooking lush botanical gardens',
    aspectRatio: '16:9',
  },
};

export const CABIN_IMAGES: Record<string, ImageAsset> = {
  First: {
    src: '/hero/desktop/f_014.webp',
    fallback: createTealDuotoneSvg('ROYAL FIRST SANCTUARY', 'Private Enclosed Sovereign Suite · Double Bed', 'SUITE-1A'),
    alt: 'Aircraft on an airport approach, used as an illustration for the cabin guide',
    aspectRatio: '16:9',
  },
  Business: {
    src: '/hero/desktop/f_048.webp',
    fallback: createTealDuotoneSvg('EXECUTIVE DIPLOMATIC', '1-2-1 Direct Aisle Access · Noise-Canceling', 'EXEC-3F'),
    alt: 'Aircraft in flight, used as an illustration for the cabin guide',
    aspectRatio: '16:9',
  },
  Economy: {
    src: '/hero/desktop/f_082.webp',
    fallback: createTealDuotoneSvg('VANGUARD PREMIUM', '40-Inch Pitch · Ergonomic Articulated Cradle', 'VANG-12B'),
    alt: 'Aircraft at the airport, used as an illustration for the cabin guide',
    aspectRatio: '16:9',
  },
};
