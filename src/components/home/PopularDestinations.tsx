import React, { useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AIRPORTS } from '../../data/mockData';
import { DESTINATION_IMAGES } from '../../data/images';
import { formatPrice } from '../../services/currency';
import { ArrowLeft, ArrowRight, Plane, MapPin } from 'lucide-react';

const FEATURED_DESTINATIONS = [
  {
    code: 'ABV',
    city: 'Abuja',
    country: 'Nigeria',
    tagline: 'Granite Monoliths & Diplomatic Groves',
    startingPriceNgn: 132_000,
    flightDuration: '1h 15m',
    bestSeason: 'Nov – Feb',
  },
  {
    code: 'DXB',
    city: 'Dubai',
    country: 'United Arab Emirates',
    tagline: 'Desert Modernism & Golden Skylines',
    startingPriceNgn: 1_280_000,
    flightDuration: '7h 30m',
    bestSeason: 'Oct – Apr',
  },
  {
    code: 'ACC',
    city: 'Accra',
    country: 'Ghana',
    tagline: 'Atlantic Surf & Heritage Coast',
    startingPriceNgn: 215_000,
    flightDuration: '1h 10m',
    bestSeason: 'Dec – Mar',
  },
  {
    code: 'NBO',
    city: 'Nairobi',
    country: 'Kenya',
    tagline: 'Highland Savannah & Safari Gateways',
    startingPriceNgn: 790_000,
    flightDuration: '5h 45m',
    bestSeason: 'Jul – Oct',
  },
  {
    code: 'LHR',
    city: 'London',
    country: 'United Kingdom',
    tagline: 'Thames Heritage & Royal Quarters',
    startingPriceNgn: 1_840_000,
    flightDuration: '6h 55m',
    bestSeason: 'May – Sep',
  },
  {
    code: 'JNB',
    city: 'Johannesburg',
    country: 'South Africa',
    tagline: 'Highveld Horizons & Cultural Epicenter',
    startingPriceNgn: 920_000,
    flightDuration: '6h 10m',
    bestSeason: 'Sep – Nov',
  },
];

export const PopularDestinations: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { setFlightSearch, setActiveRoute, currency } = useAppStore();

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const offset = direction === 'left' ? -380 : 380;
    scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const handleSelectDestination = (destCode: string) => {
    setFlightSearch({
      originCode: 'LOS',
      destinationCode: destCode,
    });
    setActiveRoute('/flights');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative overflow-hidden">
      {/* Ghost section watermark */}
      <span aria-hidden="true" className="wm-text select-none">ROUTES</span>
      {/* Content above watermark */}
      <div className="relative z-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#2B7574] dark:text-[#F2B632] uppercase block mb-1">
            01. FEATURED DESTINATIONS · LIVE FARES
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#0E2931] dark:text-[#EAEFEF] uppercase">
            POPULAR FLIGHT ROUTES
          </h2>
          <p className="text-sm text-[#12484C]/80 dark:text-[#A5D1E1] mt-1 max-w-xl">
            Curated journeys departing from Lagos MM2. Starting fares include all terminal fees and standard baggage.
          </p>
        </div>

        {/* Scroll Controls */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => handleScroll('left')}
            aria-label="Previous destination"
            className="w-10 h-10 rounded-xl border border-[#2B7574]/30 hover:bg-[#12484C]/10 dark:hover:bg-white/10 active:scale-95 text-[#0E2931] dark:text-[#EAEFEF] flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            aria-label="Next destination"
            className="w-10 h-10 rounded-xl border border-[#2B7574]/30 hover:bg-[#12484C]/10 dark:hover:bg-white/10 active:scale-95 text-[#0E2931] dark:text-[#EAEFEF] flex items-center justify-center transition-all cursor-pointer shadow-sm"
          >
            <ArrowRight className="w-4 h-4 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {/* Horizontal Native Scroll-Snap Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-6 pt-2"
      >
        {FEATURED_DESTINATIONS.map((dest) => {
          const imgAsset = DESTINATION_IMAGES[dest.code] || DESTINATION_IMAGES.LOS;

          return (
            <div
              key={dest.code}
              onClick={() => handleSelectDestination(dest.code)}
              className="snap-start shrink-0 w-[300px] sm:w-[340px] rounded-3xl bg-white dark:bg-[#0E2931]/70 border border-[#2B7574]/20 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(18,72,76,0.35)] transition-all duration-500 group cursor-pointer overflow-hidden flex flex-col justify-between"
            >
              {/* Image Frame with Duotone Fallback */}
              <div className="relative h-48 w-full overflow-hidden bg-[#12484C]">
                <img
                  src={imgAsset.src}
                  onError={(e) => {
                    // Seamless duotone fallback
                    (e.target as HTMLImageElement).src = imgAsset.fallback;
                  }}
                  alt={dest.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Airport Code Stamp */}
                <div className="absolute top-3 right-3 bg-[#0E2931]/80 backdrop-blur-sm border border-[#2B7574]/40 text-[#F2B632] px-2.5 py-1 rounded font-mono text-xs font-bold">
                  LOS → {dest.code}
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 left-3 bg-[#0E2931]/70 backdrop-blur-sm text-[#F4F6F5] px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1">
                  <Plane className="w-3 h-3 text-[#F2B632] stroke-[1.5]" />
                  <span>{dest.flightDuration} · Nonstop</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-[#2B7574] dark:text-[#A5D1E1] mb-1 font-mono">
                    <MapPin className="w-3 h-3 stroke-[1.5]" />
                    <span>{dest.country}</span>
                    <span>·</span>
                    <span>Best: {dest.bestSeason}</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase tracking-wide">
                    {dest.city}
                  </h3>
                  <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1]/80 mt-1 line-clamp-2">
                    {dest.tagline}
                  </p>
                </div>

                {/* Perforated divider before ticket price footer */}
                <div className="border-perforated my-4" />

                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] uppercase font-mono text-[#12484C] dark:text-[#A5D1E1]">
                      From
                    </span>
                    <span className="text-base font-bold tabular-nums text-[#0E2931] dark:text-[#F2B632]">
                      {formatPrice(dest.startingPriceNgn, currency)}
                    </span>
                  </div>

                  <span className="text-xs font-semibold text-[#12484C] dark:text-[#F2B632] group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Explore Flights →
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </section>
  );
};