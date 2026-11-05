import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { DESTINATION_IMAGES } from '../../data/images';
import { formatPrice } from '../../services/currency';
import { Plane, Calendar, MapPin, ArrowRight, Sun, Compass, Sparkles, Navigation } from 'lucide-react';
import { RevealOnScroll } from '../common/RevealOnScroll';

interface DestinationGuide {
  code: string;
  city: string;
  country: string;
  flightTimeFromLos: string;
  climate: string;
  desc: string;
  bestMonths: string;
  avgFlightNgn: number;
  topHotel: string;
  signatureExperience: string;
}

const DESTINATION_GUIDES: DestinationGuide[] = [
  {
    code: 'LOS',
    city: 'Lagos',
    country: 'Nigeria',
    flightTimeFromLos: 'Hub Station',
    climate: '29°C · Atlantic Breeze',
    desc: 'The pulsating economic engine of West Africa. Atlantic beachfront sanctuaries, contemporary private galleries in Ikoyi, and Michelin-caliber African dining.',
    bestMonths: 'November to February (Dry season)',
    avgFlightNgn: 148500,
    topHotel: 'The Eko Grand Oasis, Victoria Island',
    signatureExperience: 'Private catamaran charter along Lekki peninsula at sunset.',
  },
  {
    code: 'ABV',
    city: 'Abuja',
    country: 'Nigeria',
    flightTimeFromLos: '1h 10m Non-Stop',
    climate: '28°C · Monolith Plateau',
    desc: 'Bespoke administrative capital carved against the monolithic granitic silhouette of Aso Rock. Broad tree-lined diplomatic corridors and private villas.',
    bestMonths: 'December to March',
    avgFlightNgn: 132000,
    topHotel: 'Transcorp Royal Meridian, Maitama',
    signatureExperience: 'Helicopter tour across Zuma Rock monolith and presidential valley.',
  },
  {
    code: 'ACC',
    city: 'Accra',
    country: 'Ghana',
    flightTimeFromLos: '1h 00m Direct',
    climate: '27°C · Gold Coast Bay',
    desc: 'The cosmopolitan heart of the Gulf of Guinea. Rich Atlantic heritage, beachfront live jazz lounges, and modern art museums in Osu.',
    bestMonths: 'November to April',
    avgFlightNgn: 215000,
    topHotel: 'Labadi Horizon Beach Resort',
    signatureExperience: 'Tasting menu at bespoke coastal seafood pavilion.',
  },
  {
    code: 'NBO',
    city: 'Nairobi',
    country: 'Kenya',
    flightTimeFromLos: '5h 30m Direct',
    climate: '24°C · Highland Savannah',
    desc: 'Where safari plains meet gleaming architectural glass. Watch rhinos and lions roam with skyscrapers as a backdrop, before ascending into the Great Rift.',
    bestMonths: 'July to October, Jan to Feb',
    avgFlightNgn: 790000,
    topHotel: 'Norfolk Sanctuary, Upper Hill',
    signatureExperience: 'Sunrise hot air balloon ascent over the Maasai Mara boundary.',
  },
  {
    code: 'DXB',
    city: 'Dubai',
    country: 'United Arab Emirates',
    flightTimeFromLos: '7h 45m Direct',
    climate: '26°C · Arabian Marina',
    desc: 'The pinnacle of futuristic desert architectural ambition. Private yacht charters along Dubai Canal, Michelin rooftop terraces, and desert luxury pavilions.',
    bestMonths: 'October to April',
    avgFlightNgn: 1280000,
    topHotel: 'Burj Al-Zafaran, Downtown Dubai',
    signatureExperience: 'Private sky lounge tasting overlooking Burj Khalifa fountains.',
  },
  {
    code: 'LHR',
    city: 'London',
    country: 'United Kingdom',
    flightTimeFromLos: '6h 40m Direct',
    climate: '18°C · Thames Basin',
    desc: 'Timeless royal metropolis. Georgian garden squares in Mayfair, private members clubs in St. James, and world-class West End theatre.',
    bestMonths: 'May to September',
    avgFlightNgn: 1840000,
    topHotel: 'The Mayfair Colony, Mayfair',
    signatureExperience: 'Curated private after-hours walkthrough at royal art collection.',
  },
  {
    code: 'JNB',
    city: 'Johannesburg',
    country: 'South Africa',
    flightTimeFromLos: '5h 50m Direct',
    climate: '23°C · Highveld Plateau',
    desc: 'The vibrant City of Gold. Leafy jacaranda avenues in Sandton, private wine cellar estates, and the gateway to southern safari sanctuaries.',
    bestMonths: 'Sept to Nov, March to May',
    avgFlightNgn: 920000,
    topHotel: 'The Saxon Crest, Sandhurst',
    signatureExperience: 'Exclusive sommelier tasting flight of premier Stellenbosch vintages.',
  },
];

export const DestinationsView: React.FC = () => {
  const { setFlightSearch, setActiveRoute, currency } = useAppStore();

  const handleBookCity = (code: string) => {
    setFlightSearch({
      originCode: 'LOS',
      destinationCode: code,
    });
    setActiveRoute('/flights');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 animate-fade-in">
      {/* Magazine Editorial Hero */}
      <div className="bg-[#09171C] text-white rounded-3xl p-6 sm:p-10 border border-[#2B7574]/40 shadow-2xl relative overflow-hidden">
        <div className="bg-topo absolute inset-0 opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#18363F]">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono tracking-widest text-[#F2B632] uppercase font-bold">
                04. CURATED CONTINENTAL CORRIDORS & EXPEDITIONS
              </span>
            </div>
            <h1 className="font-monument text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white">
              CONTINENTAL ATLAS
            </h1>
            <p className="text-sm text-[#A5D1E1] font-light leading-relaxed">
              Explore Aerovista&apos;s verified air corridors. Each destination features synchronized luxury hotel suites, runway Mercedes transfers, and direct GDS carrier inventory.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 font-mono text-xs">
            <div className="inline-flex items-center gap-2 bg-[#12484C] text-[#F2B632] px-4 py-2 rounded-xl border border-[#2B7574]/50">
              <Compass className="w-4 h-4 text-[#F2B632] animate-spin-slow" />
              <span>40+ CONTINENTAL TRANSIT HUBS</span>
            </div>
            <span className="text-[11px] text-[#A5D1E1]/70">
              Departures daily from Lagos (LOS) & Abuja (ABV)
            </span>
          </div>
        </div>
      </div>

      {/* Destinations Grid with Editorial Photography */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {DESTINATION_GUIDES.map((d) => {
          const imgAsset = DESTINATION_IMAGES[d.code] || DESTINATION_IMAGES.LOS;

          return (
            <div
              key={d.code}
              className="rounded-3xl bg-white dark:bg-[#0E2931]/90 border border-[#2B7574]/30 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(18,72,76,0.35)] hover:border-[#F2B632]/50 overflow-hidden transition-all duration-500 flex flex-col justify-between group relative"
            >
              {/* Photo Frame */}
              <div className="relative h-56 w-full bg-[#12484C] overflow-hidden">
                <img
                  src={imgAsset.src}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = imgAsset.fallback;
                  }}
                  alt={d.city}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E2931] via-transparent to-black/30" />

                <div className="absolute top-4 right-4 bg-[#09171C]/90 backdrop-blur-md border border-[#2B7574]/50 text-[#F2B632] px-3 py-1 rounded-full font-mono text-xs font-bold shadow-md">
                  {d.code}
                </div>

                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-[#F2B632]" />
                  <span>{d.climate}</span>
                </div>

                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs font-mono text-white">
                  <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
                    <MapPin className="w-3.5 h-3.5 text-[#F2B632]" />
                    <span>{d.country}</span>
                  </div>
                  <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-[#A5D1E1]">
                    {d.flightTimeFromLos}
                  </span>
                </div>
              </div>

              {/* Editorial Description & Sanctuary details */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <h3 className="font-display text-2xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase">
                    {d.city}
                  </h3>

                  <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] leading-relaxed font-light line-clamp-3">
                    {d.desc}
                  </p>

                  <div className="space-y-2 pt-2 text-[11px] font-mono text-[#2B7574] dark:text-[#A5D1E1]">
                    <div className="flex items-center gap-1.5 bg-[#12484C]/10 dark:bg-[#12484C]/40 p-2 rounded-xl">
                      <Calendar className="w-3.5 h-3.5 text-[#F2B632] shrink-0" />
                      <span>Best Season: <strong>{d.bestMonths}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#12484C]/10 dark:bg-[#12484C]/40 p-2 rounded-xl">
                      <Sparkles className="w-3.5 h-3.5 text-[#F2B632] shrink-0" />
                      <span className="truncate">Sanctuary: <strong>{d.topHotel}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="border-t border-[#E2E2E0] dark:border-[#18363F] pt-4 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] uppercase font-mono text-[#2B7574] dark:text-[#A5D1E1]">
                      Direct Fares From
                    </span>
                    <span className="text-xl font-bold font-mono tabular-nums text-[#0E2931] dark:text-[#F2B632]">
                      {formatPrice(d.avgFlightNgn, currency)}
                    </span>
                  </div>

                  <button
                    onClick={() => handleBookCity(d.code)}
                    className="btn-gold py-2.5 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-md group/btn"
                  >
                    <span>Book Route</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
