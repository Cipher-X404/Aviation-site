import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { CABIN_IMAGES } from '../../data/images';
import { Check, Sparkles, Wifi, Wine, Shield, ArrowRight, Bed, Armchair, Coffee } from 'lucide-react';

interface CabinTier {
  id: 'First' | 'Business' | 'Economy';
  name: string;
  subtitle: string;
  aircraft: string;
  seatPitch: string;
  bedLength: string;
  dining: string;
  connectivity: string;
  groundTransfer: string;
  loungeAccess: string;
  highlightFeatures: string[];
  imageSrc: string;
}

const CABIN_TIERS: CabinTier[] = [
  {
    id: 'First',
    name: 'ROYAL FIRST SANCTUARY SUITE',
    subtitle: 'Private Enclosed Sovereign Suites with Sliding Doors',
    aircraft: 'Boeing 787-10 & Airbus A350-1000',
    seatPitch: '82 inches',
    bedLength: '208 cm Full Double Lie-Flat',
    dining: 'Caviar Service & Dom Pérignon 2013 on demand',
    connectivity: 'Complimentary High-Throughput Starlink WiFi',
    groundTransfer: 'Mercedes-Maybach or Armored Sentinel Escort Included',
    loungeAccess: 'Diplomatic Presidential Lounge + Private Bedroom',
    highlightFeatures: [
      'Motorized acoustic sliding privacy door',
      'Dual ambient lighting with circadian sunset sync',
      'Poynton & Co. Cashmere Duvet and silk pillow',
      'Dedicated in-cabin flight attendant per 4 suites',
    ],
    imageSrc: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'Business',
    name: 'DIPLOMATIC EXECUTIVE BUSINESS',
    subtitle: 'Direct Aisle Access 1-2-1 Suite Stagger',
    aircraft: 'Airbus A330-900neo & Boeing 787-9',
    seatPitch: '60 inches',
    bedLength: '198 cm Fully Flat Bed',
    dining: '3-Course Multi-Choice Continental & Regional Tasting',
    connectivity: 'High-speed satellite messaging and stream WiFi',
    groundTransfer: 'Priority Executive Chauffeur Booking Access',
    loungeAccess: 'Unlimited Sovereign Executive Business Lounges',
    highlightFeatures: [
      'Direct aisle access from every individual seat',
      'Active noise-canceling Bose A30 headsets',
      '18-inch 4K touchscreen IFE with Bluetooth pairing',
      'Fast-track diplomatic security lane in LOS & ABV',
    ],
    imageSrc: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'Economy',
    name: 'VANGUARD PREMIUM COMFORT',
    subtitle: 'Generous 40-Inch Pitch & Ergonomic Recline',
    aircraft: 'Fleet-wide Deployment',
    seatPitch: '40 inches (Industry leading)',
    bedLength: '8-inch deep recline with articulated cradle',
    dining: 'Chef-crafted warm entrees & complimentary premium beverages',
    connectivity: 'On-board messaging portal & USB-C 65W charging',
    groundTransfer: 'Standard Terminal Pickup Points',
    loungeAccess: 'Day Pass Available via Royal Miles',
    highlightFeatures: [
      'Extra legroom with adjustable 6-way leather headrest',
      'Curated West African comfort delicacies and wine',
      'Generous 2 × 23kg checked baggage allowance',
      'Priority boarding ahead of standard groups',
    ],
    imageSrc: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
];

export const FleetCabinShowcase: React.FC = () => {
  const [selectedTierId, setSelectedTierId] = useState<'First' | 'Business' | 'Economy'>('First');
  const { setFlightSearch, setActiveRoute } = useAppStore();

  const selectedTier = CABIN_TIERS.find((t) => t.id === selectedTierId) || CABIN_TIERS[0];

  const handleSelectCabinAndBook = (cabin: 'First' | 'Business' | 'Economy') => {
    setFlightSearch({
      cabinClass: cabin,
    });
    setActiveRoute('/flights');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F2B632]" />
            <span className="text-xs font-mono tracking-widest text-[#2B7574] dark:text-[#F2B632] uppercase">
              04. THE PRIVATE FLEET & CABIN ARCHITECTURE
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#0E2931] dark:text-[#EAEFEF] uppercase">
            CABIN SUITES & ON-BOARD CRAFT
          </h2>
          <p className="text-sm text-[#12484C]/80 dark:text-[#A5D1E1] mt-1 max-w-2xl">
            Designed for executive discretion, acoustic stillness, and deep restorative sleep over long-haul corridors.
          </p>
        </div>

        {/* Segmented Cabin Switcher */}
        <div className="flex items-center gap-2 bg-[#F4F6F5] dark:bg-[#0E2931]/60 p-1.5 rounded-2xl border border-[#2B7574]/20 shadow-sm self-start md:self-auto">
          {CABIN_TIERS.map((tier) => (
            <button
              key={tier.id}
              type="button"
              onClick={() => setSelectedTierId(tier.id)}
              className={`px-4 py-2 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                selectedTierId === tier.id
                  ? 'bg-[#12484C] text-[#F2B632] shadow-md'
                  : 'text-[#12484C] dark:text-[#A5D1E1] hover:text-[#0E2931] dark:hover:text-white'
              }`}
            >
              {tier.id === 'First' ? 'Royal First' : tier.id === 'Business' ? 'Executive' : 'Vanguard'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Feature Display Card */}
      <div className="rounded-3xl bg-white dark:bg-[#0E2931]/80 shadow-[0_20px_50px_-15px_rgba(18,72,76,0.15)] border border-[#2B7574]/15 overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all duration-300">
        {/* Left Side: Editorial Details */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#2B7574] dark:text-[#F2B632] uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{selectedTier.aircraft}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold uppercase text-[#0E2931] dark:text-white">
              {selectedTier.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#12484C]/80 dark:text-[#A5D1E1] mt-1">
              {selectedTier.subtitle}
            </p>

            {/* Spec Matrix Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-[#E2E2E0] dark:border-[#1E3E47] text-xs font-mono">
              <div className="p-3 rounded-xl bg-[#F4F6F5] dark:bg-[#0B1E24]">
                <span className="text-[10px] text-[#12484C]/60 dark:text-[#A5D1E1]/60 block uppercase">
                  Seat Pitch
                </span>
                <span className="font-bold text-[#0E2931] dark:text-[#F2B632] text-sm">
                  {selectedTier.seatPitch}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F4F6F5] dark:bg-[#0B1E24]">
                <span className="text-[10px] text-[#12484C]/60 dark:text-[#A5D1E1]/60 block uppercase">
                  Bed Surface
                </span>
                <span className="font-bold text-[#0E2931] dark:text-white text-sm">
                  {selectedTier.bedLength}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#F4F6F5] dark:bg-[#0B1E24] col-span-2 sm:col-span-1">
                <span className="text-[10px] text-[#12484C]/60 dark:text-[#A5D1E1]/60 block uppercase">
                  Connectivity
                </span>
                <span className="font-bold text-emerald-500 text-sm">
                  Starlink 200 Mbps
                </span>
              </div>
            </div>

            {/* Checklist Highlights */}
            <div className="mt-6 space-y-2.5">
              {selectedTier.highlightFeatures.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#0E2931] dark:text-[#EAEFEF]">
                  <div className="w-4 h-4 rounded-full bg-[#12484C] text-[#F2B632] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-[#E2E2E0] dark:border-[#1E3E47] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-mono text-[#12484C]/80 dark:text-[#A5D1E1]">
              Included: <strong>{selectedTier.groundTransfer}</strong>
            </div>

            <button
              type="button"
              onClick={() => handleSelectCabinAndBook(selectedTier.id)}
              className="w-full sm:w-auto btn-gold px-6 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>Search Flights in {selectedTier.id} Class</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Side: High-Resolution Photo Card */}
        <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full overflow-hidden bg-[#12484C]">
          <img
            src={CABIN_IMAGES[selectedTier.id]?.src || CABIN_IMAGES.First.src}
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                CABIN_IMAGES[selectedTier.id]?.fallback || CABIN_IMAGES.First.fallback;
            }}
            alt={selectedTier.name}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E2931]/80 via-transparent to-transparent pointer-events-none" />

          {/* Cabin Code Stamp */}
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#0E2931]/80 backdrop-blur-md border border-white/10 text-white flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#F2B632] uppercase block">AEROVISTA PRIVATE FLEET</span>
              <span className="font-display font-bold text-sm uppercase">{selectedTier.name}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-[#F2B632] text-[#0E2931] flex items-center justify-center font-bold text-xs">
              {selectedTier.id.slice(0, 3).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
