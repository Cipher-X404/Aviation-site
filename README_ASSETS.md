# Aerovista Visual Asset Specification & Manifest

This document inventories all visual media slots across the Aerovista platform, detailing dimensions, aspect ratios, subjects, and implemented fallback modes.

## 1. Hero Scroll Canvas Sequences
- **Desktop Sequence**:
  - Path: `/public/hero/desktop/f_001.webp` through `f_096.webp` (96 frames)
  - Dimensions: 1440 x 792 px, WebP format
  - Content: Dawn airport runway taxi, ascent into sunset clouds, coastal metropolis aerial skyline, arrival into luxury hotel lobby.
  - Controlled by: Pinned `<canvas>` with GSAP ScrollTrigger (scrub: 0.5, 450vh scroll distance).
- **Mobile Sequence**:
  - Path: `/public/hero/mobile/f_001.webp` through `f_048.webp` (48 frames)
  - Dimensions: 720 x 396 px, WebP format
  - Content: Mobile-optimized frame sequence with progressive loading.
- **Static Poster Fallback**:
  - Path: `/public/hero/desktop/f_001.webp` (for `prefers-reduced-motion` and initial paint).

## 2. Destination Visual Slots (16:9 Aspect Ratio, 800 x 500 px)
- `LOS` (Lagos): Coastal metropolis, Atlantic shoreline, Lekki-Ikoyi suspension cable silhouette at dusk.
- `ABV` (Abuja): Monolithic granite hills, green savannah valleys, grand government terraces.
- `PHC` (Port Harcourt): Riverine delta, tropical mangrove waterways, lush southern panorama.
- `ACC` (Accra): Gold Coast palm-lined coastline, modern beachfront boutique architecture.
- `NBO` (Nairobi): Wildlife silhouette meeting modern high-rise skyline, Great Rift highlands.
- `DXB` (Dubai): Futuristic architectural towers reflecting golden-hour desert sunlight.
- `LHR` (London): River Thames embankment, stone bridges, cool morning atmospheric light.
- `JNB` (Johannesburg): Highveld plateau view, jacaranda trees, Sandton skyline.

## 3. Curated Hotel Accommodations (16:9 Aspect Ratio, 800 x 500 px)
- `The Eko Grand Oasis` (Lagos): 5-star oceanfront suites, infinity pool overlooking Atlantic surf, 24/7 dedicated generator grid.
- `Transcorp Royal Meridian` (Abuja): Diplomatic suite, private marble baths, helipad access.
- `Burj Al-Zafaran` (Dubai): Downtown penthouse with panoramic skyline terrace and private spa.
- `The Saxon Crest` (Johannesburg): Sandhurst private estate, indigenous acacia gardens.
- `The Mayfair Colony` (London): Heritage British suites, dark mahogany, curated library lounge.
- `Norfolk Sanctuary` (Nairobi): Botanical courtyard, colonial veranda, colonial architecture.

## 4. Fallback Architecture
All slots are configured with inline SVG duotone vector fallbacks utilizing the `--ink` (`#0E2931`), `--deep` (`#12484C`), `--ocean-1` (`#0D5C75`), and `--gold` (`#F2B632`) color tokens with subtle topographic contour lines, ensuring zero broken image frames across all sandboxes and offline states.
