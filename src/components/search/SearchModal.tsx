import React, { useState, useEffect, useRef } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AIRPORTS, MOCK_FLIGHTS, MOCK_HOTELS } from '../../data/mockData';
import { formatPrice } from '../../services/currency';
import {
  Search,
  Plane,
  Building2,
  MapPin,
  CreditCard,
  ArrowRight,
  X,
  Radio,
} from 'lucide-react';

interface SearchResultItem {
  id: string;
  category: 'flight' | 'hotel' | 'destination' | 'service';
  title: string;
  subtitle: string;
  badge?: string;
  routeTarget: string;
  priceNgn?: number;
  metadata?: Record<string, string | undefined>;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'flight' | 'hotel' | 'service'>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  const {
    setActiveRoute,
    setFlightSearch,
    setHotelSearch,
    currency,
  } = useAppStore();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      setQuery('');
      setSelectedIndex(0);
      setActiveCategory('all');
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K and Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Curated database with concise, elegant copy
  const allSearchItems: SearchResultItem[] = [
    // Top Destinations
    ...AIRPORTS.map((apt) => ({
      id: `dest-${apt.code}`,
      category: 'destination' as const,
      title: `${apt.city} (${apt.code})`,
      subtitle: `${apt.country} · Corridors`,
      badge: 'AIRPORT',
      routeTarget: '/flights',
      metadata: { destinationCode: apt.code },
    })),

    // Active Routes
    ...MOCK_FLIGHTS.map((f) => ({
      id: `flt-${f.id}`,
      category: 'flight' as const,
      title: `${f.originCity} (${f.origin}) → ${f.destinationCity} (${f.destination})`,
      subtitle: `${f.airline} · ${f.flightNumber} · ${f.departureTime}`,
      badge: f.cabinClass,
      routeTarget: '/flights',
      priceNgn: f.priceNgn,
      metadata: {
        originCode: f.origin,
        destinationCode: f.destination,
      },
    })),

    // Curated Sanctuaries
    ...MOCK_HOTELS.map((h) => ({
      id: `htl-${h.id}`,
      category: 'hotel' as const,
      title: h.name,
      subtitle: `${h.district}, ${h.city} · ${h.starRating}★`,
      badge: h.amenities.hasGeneratorBackup ? 'Backup power' : 'Power verified',
      routeTarget: '/hotels',
      priceNgn: h.pricePerNightNgn,
      metadata: { hotelDestinationCode: h.destinationCode },
    })),

    // VIP Services & Finance
    {
      id: 'srv-fnpl',
      category: 'service',
      title: 'Fly Now Pay Later',
      subtitle: '0% APR instalment plans · CBN-licensed facility',
      badge: 'FINANCE',
      routeTarget: '/fly-now-pay-later',
    },
    {
      id: 'srv-radar',
      category: 'service',
      title: 'Animated route map',
      subtitle: 'Live radar telemetry across West African sovereign airways',
      badge: 'TELEMETRY',
      routeTarget: '/',
      metadata: { scrollTo: 'live-radar-section' },
    },
    {
      id: 'srv-fleet',
      category: 'service',
      title: 'Private Fleet & Cabins',
      subtitle: 'First and business class options',
      badge: 'CABINS',
      routeTarget: '/',
      metadata: { scrollTo: 'fleet-showcase-section' },
    },
    {
      id: 'srv-manifest',
      category: 'service',
      title: 'Boarding Passes & Trips',
      subtitle: 'Active tickets & travel manifest',
      badge: 'ACCOUNT',
      routeTarget: '/account',
    },
  ];

  // Filter items by category & query
  const filteredItems = allSearchItems.filter((item) => {
    if (activeCategory !== 'all') {
      if (activeCategory === 'flight' && item.category !== 'flight' && item.category !== 'destination') {
        return false;
      }
      if (activeCategory === 'hotel' && item.category !== 'hotel') {
        return false;
      }
      if (activeCategory === 'service' && item.category !== 'service') {
        return false;
      }
    }

    if (!query.trim()) return true;

    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      (item.badge && item.badge.toLowerCase().includes(q))
    );
  });

  // Ensure scroll into view when navigating via keyboard
  useEffect(() => {
    if (itemRefs.current[selectedIndex]) {
      itemRefs.current[selectedIndex]?.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  const handleSelectResult = (item: SearchResultItem) => {
    if (item.metadata?.destinationCode) {
      setFlightSearch({ destinationCode: item.metadata.destinationCode });
    }
    if (item.metadata?.originCode) {
      setFlightSearch({
        originCode: item.metadata.originCode,
        destinationCode: item.metadata.destinationCode,
      });
    }
    if (item.metadata?.hotelDestinationCode) {
      setHotelSearch({ hotelDestinationCode: item.metadata.hotelDestinationCode });
    }

    setActiveRoute(item.routeTarget);
    onClose();

    const scrollTarget = item.metadata?.scrollTo;
    if (scrollTarget) {
      setTimeout(() => {
        const el = document.getElementById(scrollTarget);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelectResult(filteredItems[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center pt-14 sm:pt-20 px-4 bg-[#061216]/80 backdrop-blur-xl animate-fade-in select-none"
      onClick={onClose}
      data-lenis-prevent="true"
    >
      <div
        className="w-full max-w-xl bg-[#09171C]/96 text-[#F4F6F5] rounded-3xl border border-[#2B7574]/40 shadow-[0_30px_90px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[82vh] animate-in zoom-in-95 duration-200 relative"
        onClick={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
        data-lenis-prevent="true"
      >
        {/* Top Gold Laser Edge */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F2B632] to-transparent" />

        {/* Search Header Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#18363F] bg-[#0E2931]/50">
          <Search className="w-5 h-5 text-[#F2B632] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search flights, destinations, hotels..."
            className="w-full bg-transparent border-none text-[#F4F6F5] placeholder-[#A5D1E1]/40 text-sm sm:text-base focus:outline-none font-sans font-medium"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setSelectedIndex(0);
                inputRef.current?.focus();
              }}
              className="p-1.5 rounded-full hover:bg-white/10 text-[#A5D1E1] transition-colors cursor-pointer"
              title="Clear input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[10px] font-mono tracking-widest text-[#A5D1E1]/60 hover:text-white px-2 py-1 rounded bg-[#12484C]/60 border border-[#2B7574]/30 cursor-pointer transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Minimal Category Filter Tabs */}
        <div className="flex items-center gap-1 px-5 py-2.5 bg-[#061216]/60 border-b border-[#18363F]">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'flight', label: 'Flights & Routes' },
              { id: 'hotel', label: 'Sanctuaries' },
              { id: 'service', label: 'Services' },
            ] as const
          ).map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#12484C] text-[#F2B632] border border-[#2B7574]/60 shadow-sm'
                  : 'text-[#A5D1E1]/70 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Scrollable Results List (data-lenis-prevent ensures native scroll wheel works) */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto overscroll-contain p-2 divide-y divide-[#18363F]/40"
          style={{ minHeight: '260px', maxHeight: '55vh' }}
          data-lenis-prevent="true"
        >
          {filteredItems.length === 0 ? (
            <div className="py-14 text-center space-y-2">
              <Search className="w-6 h-6 text-[#2B7574] mx-auto animate-pulse" />
              <p className="text-sm font-mono text-[#A5D1E1]">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-[#A5D1E1]/50 font-sans">Try searching for Lagos, London, First Class, or Radar</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={item.id}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  onClick={() => handleSelectResult(item)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-[#12484C]/90 text-white shadow-md border-l-4 border-l-[#F2B632] translate-x-0.5'
                      : 'hover:bg-white/5 text-[#EAEFEF]'
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${
                        item.category === 'flight'
                          ? 'bg-[#0D5C75]/60 border-[#199FB1]/40 text-[#F2B632]'
                          : item.category === 'hotel'
                          ? 'bg-amber-950/60 border-amber-600/40 text-amber-300'
                          : item.category === 'destination'
                          ? 'bg-emerald-950/60 border-emerald-600/40 text-emerald-300'
                          : 'bg-[#12484C] border-[#2B7574] text-[#A5D1E1]'
                      }`}
                    >
                      {item.category === 'flight' && <Plane className="w-4 h-4 -rotate-45" />}
                      {item.category === 'hotel' && <Building2 className="w-4 h-4" />}
                      {item.category === 'destination' && <MapPin className="w-4 h-4" />}
                      {item.category === 'service' && <Radio className="w-4 h-4" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{item.title}</span>
                        {item.badge && (
                          <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-black/40 text-[#F2B632] border border-[#F2B632]/30 shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#A5D1E1]/70 truncate mt-0.5 font-mono">{item.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    {item.priceNgn && (
                      <span className="font-mono text-xs font-bold text-[#F2B632]">
                        {formatPrice(item.priceNgn, currency)}
                      </span>
                    )}
                    <ArrowRight
                      className={`w-4 h-4 transition-all duration-200 ${
                        isSelected ? 'opacity-100 translate-x-0.5 text-[#F2B632]' : 'opacity-20 text-white'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Compact Footer */}
        <div className="px-5 py-2.5 bg-[#061216] border-t border-[#18363F] flex items-center justify-between text-[11px] font-mono text-[#A5D1E1]/50">
          <span>Use ↑ ↓ to navigate · ↵ to select</span>
          <span className="text-[#F2B632]/80">AEROVISTA SEARCH</span>
        </div>
      </div>
    </div>
  );
};
