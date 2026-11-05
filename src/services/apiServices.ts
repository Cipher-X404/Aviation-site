import {
  AIRPORTS,
  Airport,
  BundleDeal,
  Flight,
  Hotel,
  MOCK_BUNDLES,
  MOCK_FLIGHTS,
  MOCK_HOTELS,
} from '../data/mockData';
import {
  LoanApplicationInput,
  LoanDecisionResult,
  evaluateLoanApplication,
} from '../config/loan';

// Helper for simulated network delay between 800ms and 1400ms
const simulateDelay = (min = 800, max = 1400) => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export interface FlightSearchParams {
  originCode: string;
  destinationCode: string;
  departureDate?: string;
  returnDate?: string;
  tripType?: 'round-trip' | 'one-way' | 'multi-city';
  passengers?: number;
  cabinClass?: 'Economy' | 'Business' | 'First';
  stopsFilter?: number | 'all';
  maxPriceNgn?: number;
  sortBy?: 'best' | 'cheapest' | 'fastest';
}

/**
 * Typo-tolerant airport search matching city, name, and 3-letter IATA code.
 */
export function searchAirports(query: string): Airport[] {
  const clean = query.trim().toLowerCase();
  if (!clean) return AIRPORTS.slice(0, 5);

  return AIRPORTS.filter((airport) => {
    return (
      airport.code.toLowerCase().includes(clean) ||
      airport.city.toLowerCase().includes(clean) ||
      airport.name.toLowerCase().includes(clean) ||
      airport.country.toLowerCase().includes(clean)
    );
  });
}

/**
 * Retrieve flights with simulated network latency and robust client-side filtering.
 */
export async function getFlights(params?: FlightSearchParams): Promise<Flight[]> {
  await simulateDelay(800, 1500);

  let results = [...MOCK_FLIGHTS];

  if (params?.originCode) {
    results = results.filter(
      (f) => f.origin.toLowerCase() === params.originCode.toLowerCase()
    );
  }

  if (params?.destinationCode) {
    results = results.filter(
      (f) => f.destination.toLowerCase() === params.destinationCode.toLowerCase()
    );
  }

  if (params?.cabinClass) {
    results = results.filter((f) => f.cabinClass === params.cabinClass);
  }

  if (params?.stopsFilter !== undefined && params.stopsFilter !== 'all') {
    results = results.filter((f) => f.stops === params.stopsFilter);
  }

  if (params?.maxPriceNgn) {
    results = results.filter((f) => f.priceNgn <= params.maxPriceNgn!);
  }

  // Sorting
  if (params?.sortBy === 'cheapest') {
    results.sort((a, b) => a.priceNgn - b.priceNgn);
  } else if (params?.sortBy === 'fastest') {
    results.sort((a, b) => a.duration.localeCompare(b.duration));
  } else {
    // "Best" composite score
    results.sort((a, b) => b.score - a.score);
  }

  return results;
}

/**
 * Retrieve hotels matching a destination code.
 */
export async function getHotels(destinationCode?: string): Promise<Hotel[]> {
  await simulateDelay(800, 1300);

  if (!destinationCode || destinationCode === 'all') {
    return [...MOCK_HOTELS];
  }

  const filtered = MOCK_HOTELS.filter(
    (h) => h.destinationCode.toLowerCase() === destinationCode.toLowerCase()
  );

  return filtered.length > 0 ? filtered : MOCK_HOTELS;
}

/**
 * Get individual hotel by ID.
 */
export async function getHotelById(hotelId: string): Promise<Hotel | undefined> {
  await simulateDelay(600, 1000);
  return MOCK_HOTELS.find((h) => h.id === hotelId);
}

/**
 * Get curated Flight + Hotel bundle deals.
 */
export async function getBundles(): Promise<BundleDeal[]> {
  await simulateDelay(700, 1200);
  return [...MOCK_BUNDLES];
}

/**
 * Submit loan application for Fly Now, Pay Later with underwriting check.
 */
export async function submitLoanApplication(
  data: LoanApplicationInput
): Promise<LoanDecisionResult> {
  // Realistic processing delay for credit evaluation
  await simulateDelay(1200, 1800);
  return evaluateLoanApplication(data);
}
