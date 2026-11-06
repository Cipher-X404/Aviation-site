import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_BUNDLES, MOCK_FLIGHTS, MOCK_HOTELS } from '../../data/mockData';
import { HOTEL_IMAGES } from '../../data/images';
import { formatPrice } from '../../services/currency';
import { Plane, Building2, ArrowRight, Check } from 'lucide-react';

export const BundleShowcase: React.FC = () => {
  const { setSelectedFlight, setSelectedHotel, setActiveRoute, currency } = useAppStore();

  const handleBookBundle = (flightId: string, hotelId: string) => {
    const flight = MOCK_FLIGHTS.find((f) => f.id === flightId) || null;
    const hotel = MOCK_HOTELS.find((h) => h.id === hotelId) || null;

    setSelectedFlight(flight);
    setSelectedHotel(hotel);
    setActiveRoute('/flights/book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="bundle-showcase-section" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
        <div>
          <span className="text-xs font-mono tracking-widest text-[#2B7574] dark:text-[#F2B632] uppercase block mb-1">
            CURATED PACKAGES
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#0E2931] dark:text-[#EAEFEF] uppercase">
            FLIGHT + HOTEL BUNDLES
          </h2>
          <p className="text-sm text-[#12484C]/80 dark:text-[#A5D1E1] mt-1 max-w-xl">
            Curated Flight + Sanctuary bundles. Synchronized tarmac chauffeur and verified power resilience included. Book each component separately or as a complete package.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {MOCK_BUNDLES.map((bundle) => {
          const flight = MOCK_FLIGHTS.find((f) => f.id === bundle.flightId);
          const hotel = MOCK_HOTELS.find((h) => h.id === bundle.hotelId);
          const hotelImg = HOTEL_IMAGES[bundle.hotelId] || HOTEL_IMAGES['hotel-eko-grand'];

          return (
            <div
              key={bundle.id}
              className="rounded-3xl bg-white dark:bg-[#0E2931]/70 border border-[#2B7574]/20 overflow-hidden shadow-sm flex flex-col justify-between hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(18,72,76,0.35)] transition-all duration-500 group"
            >
              {/* Hotel Imagery & Header */}
              <div className="relative h-56 w-full overflow-hidden bg-[#12484C]">
                <img
                  src={hotelImg.src}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = hotelImg.fallback;
                  }}
                  alt={hotel?.name || 'Bundle hotel'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-4 right-4 bg-[#09171C]/85 text-[#F4F6F5] px-3 py-1 border border-white/20 font-mono text-xs uppercase tracking-wider">
                  SOVEREIGN BUNDLE
                </div>

                {/* Destination Badge */}
                <div className="absolute bottom-4 left-4 bg-[#0E2931]/80 backdrop-blur-sm text-[#F4F6F5] px-3 py-1 rounded text-xs font-mono">
                  {bundle.destinationCity} ({bundle.destinationCode}) · {bundle.totalNights} Nights
                </div>
              </div>

              {/* Package Specs */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase">
                    {hotel?.name}
                  </h3>

                  <div className="space-y-2 text-xs text-[#12484C] dark:text-[#A5D1E1]">
                    <div className="flex items-center gap-2">
                      <Plane className="w-4 h-4 text-[#2B7574] dark:text-[#F2B632] stroke-[1.5]" />
                      <span>
                        Confirmed flight · {flight?.airline} {flight?.flightNumber} ({flight?.cabinClass})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#2B7574] dark:text-[#F2B632] stroke-[1.5]" />
                      <span>
                        {bundle.totalNights} nights · verified sanctuary stay
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#2B7574] dark:text-[#F2B632] stroke-[1.5]" />
                      <span>Tarmac chauffeur included</span>
                    </div>
                  </div>
                </div>

                {/* Ticket Stub Divider */}
                <div className="border-perforated" />

                {/* Pricing & CTA */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="block text-[11px] font-mono text-[#12484C]/70 dark:text-[#A5D1E1]/70">
                    Bundle total from
                    </span>
                    <span className="text-xl sm:text-2xl font-bold font-mono tabular-nums text-[#0E2931] dark:text-[#F2B632]">
                      {formatPrice(bundle.bundlePriceNgn, currency)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookBundle(bundle.flightId, bundle.hotelId)}
                    className="btn-gold py-2.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                  >
                    <span>Book This Package</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2]" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
