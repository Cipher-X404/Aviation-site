export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
  region: string;
  timezone: string;
}

export interface FlightSegment {
  departureAirport: string;
  departureTime: string;
  arrivalAirport: string;
  arrivalTime: string;
  duration: string;
  flightNumber: string;
  airline: string;
  aircraft: string;
  terminal: string;
  gate: string;
}

export interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string; // airport code
  originCity: string;
  destination: string; // airport code
  destinationCity: string;
  departureTime: string; // HH:mm
  arrivalTime: string; // HH:mm
  duration: string; // e.g. "1h 15m"
  stops: number; // 0 = direct
  stopsInfo?: string;
  priceNgn: number;
  originalPriceNgn?: number;
  availableSeats: number;
  aircraft: string;
  cabinClass: 'Economy' | 'Business' | 'First';
  baggageAllowance: string;
  mealIncluded: boolean;
  score: number; // for "Best" ranking
  priceTrend: 'rising' | 'falling' | 'stable';
  co2Kg: number;
  segments: FlightSegment[];
}

export interface HotelRoom {
  id: string;
  name: string;
  bedType: string;
  maxGuests: number;
  pricePerNightNgn: number;
  sqm: number;
  features: string[];
  available: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  destinationCode: string;
  city: string;
  district: string;
  starRating: number;
  reviewScore: number;
  reviewCount: number;
  pricePerNightNgn: number;
  distanceFromAirportKm: number;
  distanceFromCityCenterKm: number;
  featuredTag?: string;
  tags: string[];
  amenities: {
    hasGeneratorBackup: boolean;
    hasAirportPickup: boolean;
    hasPool: boolean;
    hasHighSpeedWifi: boolean;
    hasSpa: boolean;
    hasBreakfastIncluded: boolean;
    hasGym: boolean;
  };
  overview: string;
  rooms: HotelRoom[];
}

export interface BundleDeal {
  id: string;
  flightId: string;
  hotelId: string;
  destinationCode: string;
  destinationCity: string;
  totalNights: number;
  individualTotalNgn: number;
  bundlePriceNgn: number;
  savingsNgn: number;
  featuredReason: string;
}

export interface Testimonial {
  id: string;
  author: string;
  title: string;
  route: string;
  travelMonth: string;
  quote: string;
  verifiedBookingRef: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  category: 'booking' | 'loan' | 'hotels' | 'baggage';
}

export const AIRPORTS: Airport[] = [
  {
    code: 'LOS',
    name: 'Murtala Muhammed International Airport',
    city: 'Lagos',
    country: 'Nigeria',
    region: 'West Africa',
    timezone: 'WAT (UTC+1)',
  },
  {
    code: 'ABV',
    name: 'Nnamdi Azikiwe International Airport',
    city: 'Abuja',
    country: 'Nigeria',
    region: 'West Africa',
    timezone: 'WAT (UTC+1)',
  },
  {
    code: 'PHC',
    name: 'Port Harcourt International Airport',
    city: 'Port Harcourt',
    country: 'Nigeria',
    region: 'West Africa',
    timezone: 'WAT (UTC+1)',
  },
  {
    code: 'ACC',
    name: 'Kotoka International Airport',
    city: 'Accra',
    country: 'Ghana',
    region: 'West Africa',
    timezone: 'GMT (UTC+0)',
  },
  {
    code: 'NBO',
    name: 'Jomo Kenyatta International Airport',
    city: 'Nairobi',
    country: 'Kenya',
    region: 'East Africa',
    timezone: 'EAT (UTC+3)',
  },
  {
    code: 'DXB',
    name: 'Dubai International Airport',
    city: 'Dubai',
    country: 'United Arab Emirates',
    region: 'Middle East',
    timezone: 'GST (UTC+4)',
  },
  {
    code: 'LHR',
    name: 'London Heathrow Airport',
    city: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    timezone: 'GMT (UTC+0)',
  },
  {
    code: 'JNB',
    name: 'O.R. Tambo International Airport',
    city: 'Johannesburg',
    country: 'South Africa',
    region: 'Southern Africa',
    timezone: 'SAST (UTC+2)',
  },
];

export const MOCK_FLIGHTS: Flight[] = [
  {
    id: 'fl-101',
    airline: 'Aerovista Royal',
    flightNumber: 'AR-302',
    origin: 'LOS',
    originCity: 'Lagos',
    destination: 'ABV',
    destinationCity: 'Abuja',
    departureTime: '07:15',
    arrivalTime: '08:30',
    duration: '1h 15m',
    stops: 0,
    priceNgn: 148_500,
    originalPriceNgn: 165_000,
    availableSeats: 4,
    aircraft: 'Airbus A321neo',
    cabinClass: 'Economy',
    baggageAllowance: '23 kg checked + 8 kg cabin',
    mealIncluded: true,
    score: 9.6,
    priceTrend: 'rising',
    co2Kg: 95,
    segments: [
      {
        departureAirport: 'LOS',
        departureTime: '07:15',
        arrivalAirport: 'ABV',
        arrivalTime: '08:30',
        duration: '1h 15m',
        flightNumber: 'AR-302',
        airline: 'Aerovista Royal',
        aircraft: 'Airbus A321neo',
        terminal: 'Terminal 2',
        gate: 'B12',
      },
    ],
  },
  {
    id: 'fl-102',
    airline: 'Zenith Skyways',
    flightNumber: 'ZS-814',
    origin: 'LOS',
    originCity: 'Lagos',
    destination: 'ABV',
    destinationCity: 'Abuja',
    departureTime: '11:45',
    arrivalTime: '13:00',
    duration: '1h 15m',
    stops: 0,
    priceNgn: 132_000,
    availableSeats: 8,
    aircraft: 'Boeing 737-800',
    cabinClass: 'Economy',
    baggageAllowance: '20 kg checked + 7 kg cabin',
    mealIncluded: false,
    score: 8.9,
    priceTrend: 'stable',
    co2Kg: 104,
    segments: [
      {
        departureAirport: 'LOS',
        departureTime: '11:45',
        arrivalAirport: 'ABV',
        arrivalTime: '13:00',
        duration: '1h 15m',
        flightNumber: 'ZS-814',
        airline: 'Zenith Skyways',
        aircraft: 'Boeing 737-800',
        terminal: 'Terminal 1',
        gate: 'A04',
      },
    ],
  },
  {
    id: 'fl-103',
    airline: 'Equatorial Air',
    flightNumber: 'EQ-408',
    origin: 'LOS',
    originCity: 'Lagos',
    destination: 'ACC',
    destinationCity: 'Accra',
    departureTime: '09:30',
    arrivalTime: '09:40',
    duration: '1h 10m', // 1hr time difference
    stops: 0,
    priceNgn: 215_000,
    availableSeats: 6,
    aircraft: 'Embraer E195-E2',
    cabinClass: 'Economy',
    baggageAllowance: '23 kg checked + 10 kg cabin',
    mealIncluded: true,
    score: 9.3,
    priceTrend: 'falling',
    co2Kg: 82,
    segments: [
      {
        departureAirport: 'LOS',
        departureTime: '09:30',
        arrivalAirport: 'ACC',
        arrivalTime: '09:40',
        duration: '1h 10m',
        flightNumber: 'EQ-408',
        airline: 'Equatorial Air',
        aircraft: 'Embraer E195-E2',
        terminal: 'International Wing',
        gate: 'C08',
      },
    ],
  },
  {
    id: 'fl-104',
    airline: 'Aerovista Royal',
    flightNumber: 'AR-701',
    origin: 'LOS',
    originCity: 'Lagos',
    destination: 'DXB',
    destinationCity: 'Dubai',
    departureTime: '14:20',
    arrivalTime: '00:50',
    duration: '7h 30m',
    stops: 0,
    priceNgn: 1_280_000,
    originalPriceNgn: 1_420_000,
    availableSeats: 5,
    aircraft: 'Airbus A350-900',
    cabinClass: 'Economy',
    baggageAllowance: '2x 23 kg checked + 10 kg cabin',
    mealIncluded: true,
    score: 9.8,
    priceTrend: 'rising',
    co2Kg: 490,
    segments: [
      {
        departureAirport: 'LOS',
        departureTime: '14:20',
        arrivalAirport: 'DXB',
        arrivalTime: '00:50',
        duration: '7h 30m',
        flightNumber: 'AR-701',
        airline: 'Aerovista Royal',
        aircraft: 'Airbus A350-900',
        terminal: 'International Wing D',
        gate: 'D02',
      },
    ],
  },
  {
    id: 'fl-105',
    airline: 'Savannah Wings',
    flightNumber: 'SW-912',
    origin: 'LOS',
    originCity: 'Lagos',
    destination: 'NBO',
    destinationCity: 'Nairobi',
    departureTime: '10:00',
    arrivalTime: '17:45',
    duration: '5h 45m',
    stops: 0,
    priceNgn: 790_000,
    availableSeats: 7,
    aircraft: 'Boeing 787-9 Dreamliner',
    cabinClass: 'Economy',
    baggageAllowance: '2x 23 kg checked + 8 kg cabin',
    mealIncluded: true,
    score: 9.4,
    priceTrend: 'stable',
    co2Kg: 380,
    segments: [
      {
        departureAirport: 'LOS',
        departureTime: '10:00',
        arrivalAirport: 'NBO',
        arrivalTime: '17:45',
        duration: '5h 45m',
        flightNumber: 'SW-912',
        airline: 'Savannah Wings',
        aircraft: 'Boeing 787-9 Dreamliner',
        terminal: 'International Wing',
        gate: 'B18',
      },
    ],
  },
  {
    id: 'fl-106',
    airline: 'Aerovista Royal',
    flightNumber: 'AR-001',
    origin: 'LOS',
    originCity: 'Lagos',
    destination: 'LHR',
    destinationCity: 'London',
    departureTime: '23:15',
    arrivalTime: '06:10',
    duration: '6h 55m',
    stops: 0,
    priceNgn: 1_840_000,
    originalPriceNgn: 2_050_000,
    availableSeats: 3,
    aircraft: 'Airbus A350-1000',
    cabinClass: 'Business',
    baggageAllowance: '3x 32 kg checked + 14 kg cabin',
    mealIncluded: true,
    score: 9.9,
    priceTrend: 'rising',
    co2Kg: 520,
    segments: [
      {
        departureAirport: 'LOS',
        departureTime: '23:15',
        arrivalAirport: 'LHR',
        arrivalTime: '06:10',
        duration: '6h 55m',
        flightNumber: 'AR-001',
        airline: 'Aerovista Royal',
        aircraft: 'Airbus A350-1000',
        terminal: 'International Wing E',
        gate: 'E01',
      },
    ],
  },
  {
    id: 'fl-107',
    airline: 'Equatorial Air',
    flightNumber: 'EQ-650',
    origin: 'LOS',
    originCity: 'Lagos',
    destination: 'JNB',
    destinationCity: 'Johannesburg',
    departureTime: '13:00',
    arrivalTime: '20:10',
    duration: '6h 10m',
    stops: 0,
    priceNgn: 920_000,
    availableSeats: 9,
    aircraft: 'Airbus A330-900neo',
    cabinClass: 'Economy',
    baggageAllowance: '2x 23 kg checked + 8 kg cabin',
    mealIncluded: true,
    score: 9.1,
    priceTrend: 'stable',
    co2Kg: 440,
    segments: [
      {
        departureAirport: 'LOS',
        departureTime: '13:00',
        arrivalAirport: 'JNB',
        arrivalTime: '20:10',
        duration: '6h 10m',
        flightNumber: 'EQ-650',
        airline: 'Equatorial Air',
        aircraft: 'Airbus A330-900neo',
        terminal: 'Terminal 1',
        gate: 'B06',
      },
    ],
  },
];

export const MOCK_HOTELS: Hotel[] = [
  {
    id: 'hotel-eko-grand',
    name: 'The Eko Grand Oasis',
    destinationCode: 'LOS',
    city: 'Lagos',
    district: 'Victoria Island',
    starRating: 5,
    reviewScore: 4.8,
    reviewCount: 342,
    pricePerNightNgn: 280_000,
    distanceFromAirportKm: 24,
    distanceFromCityCenterKm: 1.5,
    featuredTag: 'Direct Ocean View',
    tags: ['Luxury', 'Oceanfront', 'Business Preferred'],
    amenities: {
      hasGeneratorBackup: true, // Crucial amenity for region
      hasAirportPickup: true,
      hasPool: true,
      hasHighSpeedWifi: true,
      hasSpa: true,
      hasBreakfastIncluded: true,
      hasGym: true,
    },
    overview:
      'Perched right at the edge of the Atlantic in Victoria Island, The Eko Grand Oasis offers unrivaled oceanfront serenity, an uninterruptible 24/7 dedicated heavy-power infrastructure, private chauffeured airport transfers, and three Michelin-inspired dining rooms.',
    rooms: [
      {
        id: 'room-eko-deluxe',
        name: 'Deluxe Ocean King',
        bedType: '1 King Bed',
        maxGuests: 2,
        pricePerNightNgn: 280_000,
        sqm: 48,
        features: ['Atlantic Ocean Balcony', 'Marble Rain Shower', 'Complimentary High-Speed Starlink', 'Nespresso Station'],
        available: true,
      },
      {
        id: 'room-eko-suite',
        name: 'Executive Atlantic Suite',
        bedType: '1 California King + Lounge',
        maxGuests: 3,
        pricePerNightNgn: 450_000,
        sqm: 78,
        features: ['Panoramic Corner Terrace', 'Butler Service', 'Executive Club Lounge Access', 'Airport Mercedes Transfer'],
        available: true,
      },
    ],
  },
  {
    id: 'hotel-transcorp-meridian',
    name: 'Transcorp Royal Meridian',
    destinationCode: 'ABV',
    city: 'Abuja',
    district: 'Maitama / Central District',
    starRating: 5,
    reviewScore: 4.9,
    reviewCount: 512,
    pricePerNightNgn: 310_000,
    distanceFromAirportKm: 38,
    distanceFromCityCenterKm: 0.8,
    featuredTag: 'Diplomatic Enclave',
    tags: ['Diplomatic', 'Helipad', 'Historic Prestige'],
    amenities: {
      hasGeneratorBackup: true,
      hasAirportPickup: true,
      hasPool: true,
      hasHighSpeedWifi: true,
      hasSpa: true,
      hasBreakfastIncluded: true,
      hasGym: true,
    },
    overview:
      'The crown jewel of Nigeria’s capital city, the Royal Meridian sits in prestigious Maitama, surrounded by landscaped gardens, state-of-the-art diplomatic security, an Olympic-sized pool, and swift highway connections to Nnamdi Azikiwe Airport.',
    rooms: [
      {
        id: 'room-meridian-classic',
        name: 'Diplomatic Garden Room',
        bedType: '1 King Bed',
        maxGuests: 2,
        pricePerNightNgn: 310_000,
        sqm: 52,
        features: ['Lush Garden Vistas', 'Deep Soaking Tub', 'Dedicated Workstation', 'High-Speed Fiber'],
        available: true,
      },
      {
        id: 'room-meridian-presidential',
        name: 'Presidential Wing Suite',
        bedType: '1 King Bed + Formal Dining',
        maxGuests: 4,
        pricePerNightNgn: 680_000,
        sqm: 110,
        features: ['Private Meeting Salon', 'Bullet-Resistant Glass', '24/7 Chef On Demand', 'Helipad Access'],
        available: true,
      },
    ],
  },
  {
    id: 'hotel-burj-zafaran',
    name: 'Burj Al-Zafaran',
    destinationCode: 'DXB',
    city: 'Dubai',
    district: 'Downtown Dubai',
    starRating: 5,
    reviewScore: 4.95,
    reviewCount: 780,
    pricePerNightNgn: 540_000,
    distanceFromAirportKm: 14,
    distanceFromCityCenterKm: 0.5,
    featuredTag: 'Canal & Skyline Panorama',
    tags: ['Ultra Luxury', 'Infinity Pool', 'Designer Interiors'],
    amenities: {
      hasGeneratorBackup: true,
      hasAirportPickup: true,
      hasPool: true,
      hasHighSpeedWifi: true,
      hasSpa: true,
      hasBreakfastIncluded: true,
      hasGym: true,
    },
    overview:
      'A masterwork of Arabesque modernism overlooking the Dubai Water Canal and the downtown towers. Features bespoke bronze lattice craftsmanship, temperature-controlled rooftop infinity pools, and round-the-clock chauffeured Maybach airport transit.',
    rooms: [
      {
        id: 'room-burj-sky',
        name: 'Skyline Skyline Premier',
        bedType: '1 King Bed',
        maxGuests: 2,
        pricePerNightNgn: 540_000,
        sqm: 65,
        features: ['Full Downtown Tower View', 'Dyson Haircare Suite', 'Automated Privacy Glass', 'Hermès Amenities'],
        available: true,
      },
    ],
  },
  {
    id: 'hotel-saxon-crest',
    name: 'The Saxon Crest',
    destinationCode: 'JNB',
    city: 'Johannesburg',
    district: 'Sandhurst',
    starRating: 5,
    reviewScore: 4.85,
    reviewCount: 220,
    pricePerNightNgn: 390_000,
    distanceFromAirportKm: 28,
    distanceFromCityCenterKm: 4.0,
    featuredTag: 'Private Villa Sanctuary',
    tags: ['Boutique Estate', 'Wine Cellar', 'Acacia Gardens'],
    amenities: {
      hasGeneratorBackup: true,
      hasAirportPickup: true,
      hasPool: true,
      hasHighSpeedWifi: true,
      hasSpa: true,
      hasBreakfastIncluded: true,
      hasGym: true,
    },
    overview:
      'Tucked within ten acres of mature acacia trees in Sandhurst, The Saxon Crest provides absolute sanctuary from city bustle. Featuring an award-winning cellar, heated outdoor lap pool, and bespoke safari connection arrangements.',
    rooms: [
      {
        id: 'room-saxon-suite',
        name: 'Sandhurst Courtyard Suite',
        bedType: '1 King Bed',
        maxGuests: 2,
        pricePerNightNgn: 390_000,
        sqm: 60,
        features: ['Courtyard Fireplace', 'African Walnut Timber', 'Private Butler Service', 'Wine Pairing Tasting'],
        available: true,
      },
    ],
  },
];

export const MOCK_BUNDLES: BundleDeal[] = [
  {
    id: 'bundle-los-abv',
    flightId: 'fl-101',
    hotelId: 'hotel-transcorp-meridian',
    destinationCode: 'ABV',
    destinationCity: 'Abuja',
    totalNights: 3,
    individualTotalNgn: 148_500 + 310_000 * 3, // ₦1,078,500
    bundlePriceNgn: 928_500,
    savingsNgn: 150_000,
    featuredReason: 'Flight + 3 Nights at Transcorp Royal Meridian with 15% combined bundle discount',
  },
  {
    id: 'bundle-los-dxb',
    flightId: 'fl-104',
    hotelId: 'hotel-burj-zafaran',
    destinationCode: 'DXB',
    destinationCity: 'Dubai',
    totalNights: 4,
    individualTotalNgn: 1_280_000 + 540_000 * 4, // ₦3,440,000
    bundlePriceNgn: 2_980_000,
    savingsNgn: 460_000,
    featuredReason: 'Return Direct Airbus A350 + 4 Nights Canal Panorama Suite with VIP transit',
  },
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    author: 'Dr. Folashade Adeleke',
    title: 'Consultant Neurosurgeon, Lagos',
    route: 'Lagos (LOS) to London (LHR)',
    travelMonth: 'September 2026',
    quote:
      'Booking medical symposium flights while keeping clinical cashflow uninterrupted was always painful. Aerovista’s Pay Later approved my transatlantic tickets in 40 seconds. The seat reservation was issued instantly on my boarding pass.',
    verifiedBookingRef: 'AV-9824-GB',
  },
  {
    id: 't-2',
    author: 'Kofi Mensah',
    title: 'Managing Director, Horizon Agrotech',
    route: 'Accra (ACC) to Nairobi (NBO)',
    travelMonth: 'October 2026',
    quote:
      'The destination hotel pre-fill is genius. As soon as I selected my flight to Nairobi, Norfolk Sanctuary was suggested with dates pre-matched to my return. Saved over two hours of coordination.',
    verifiedBookingRef: 'AV-7319-KE',
  },
  {
    id: 't-3',
    author: 'Tariq Al-Mansoor',
    title: 'Architectural Director, Dubai',
    route: 'Dubai (DXB) to Lagos (LOS)',
    travelMonth: 'August 2026',
    quote:
      'The e-ticket with offline QR boarding pass worked flawlessly at Murtala Muhammed gate security. The typographic precision and lack of clutter sets Aerovista leagues ahead of traditional agency portals.',
    verifiedBookingRef: 'AV-4182-NG',
  },
];

export const MOCK_FAQS: FaqItem[] = [
  {
    question: 'How does Fly Now, Pay Later work?',
    answer:
      'You select your flights or hotel bundle, configure your down payment (10% to 50%) and choose your preferred tenure (3, 6, 9, or 12 months). Our deterministic algorithm evaluates your application in under 60 seconds with zero paperwork. Once approved, your tickets are issued immediately, and you repay in predictable monthly instalments.',
    category: 'loan',
  },
  {
    question: 'Can I pay off my flight loan earlier than scheduled?',
    answer:
      'Yes, absolutely. Aerovista enforces zero early repayment penalties. If you settle your outstanding balance ahead of time, any unaccrued future interest is waived immediately in your account dashboard.',
    category: 'loan',
  },
  {
    question: 'How are hotels pre-filled when I search for flights?',
    answer:
      'When you pick your flight arrival city and dates, our booking intelligence automatically syncs your destination airport to top-rated vetted luxury hotels, setting check-in to your arrival day and checkout to your return flight, unlocking special bundle discounts of up to 15%.',
    category: 'hotels',
  },
  {
    question: 'What happens if my flight schedule changes?',
    answer:
      'All bookings made via Aerovista come with our Real-Time Flight Protection guarantee. You receive instant SMS/email notifications and can rebook with our airline partners in one tap with zero agency rebooking fees.',
    category: 'booking',
  },
  {
    question: 'Are generator and power backup guaranteed at hotels?',
    answer:
      'Yes. Every property in our West African and African destination collection is strictly audited for 24/7 dedicated heavy backup generation and water purification before inclusion in our catalog.',
    category: 'hotels',
  },
];
