import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getHotels } from '../../services/apiServices';
import { Hotel, AIRPORTS } from '../../data/mockData';
import { HOTEL_IMAGES } from '../../data/images';
import { formatPrice } from '../../services/currency';
import {
  Building2,
  MapPin,
  Star,
  Zap,
  Car,
  Wifi,
  ShieldCheck,
  Check,
  Calendar,
  Layers,
  Map,
  List,
  ArrowRight,
  ShieldAlert,
  Coffee,
  CheckCircle2,
} from 'lucide-react';
import { RevealOnScroll } from '../common/RevealOnScroll';

export const HotelsView: React.FC = () => {
  const {
    hotelDestinationCode,
    hotelCheckInDate,
    hotelCheckOutDate,
    hotelGuests,
    setHotelSearch,
    setSelectedHotel,
    setActiveRoute,
    currency,
  } = useAppStore();

  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [filterGeneratorOnly, setFilterGeneratorOnly] = useState(true);
  const [filterAirportPickup, setFilterAirportPickup] = useState(false);
  const [selectedHotelDetail, setSelectedHotelDetail] = useState<Hotel | null>(null);

  // Compute nights
  const checkIn = new Date(hotelCheckInDate || '2026-11-12');
  const checkOut = new Date(hotelCheckOutDate || '2026-11-18');
  const nightsCount = Math.max(1, Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 3600 * 24)));

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getHotels(hotelDestinationCode).then((data) => {
      if (isMounted) {
        let filtered = data;
        if (filterGeneratorOnly) {
          filtered = filtered.filter((h) => h.amenities.hasGeneratorBackup);
        }
        if (filterAirportPickup) {
          filtered = filtered.filter((h) => h.amenities.hasAirportPickup);
        }
        setHotels(filtered);
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [hotelDestinationCode, filterGeneratorOnly, filterAirportPickup]);

  const currentAirport = AIRPORTS.find((a) => a.code === hotelDestinationCode) || AIRPORTS[0];

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Sanctuary Hero Header */}
      <div className="bg-[#09171C] text-white rounded-3xl p-6 sm:p-8 border border-[#2B7574]/40 shadow-2xl relative overflow-hidden">
        <div className="bg-topo absolute inset-0 opacity-20 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#18363F]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono tracking-widest text-[#F2B632] uppercase font-bold">
                02. PLACES TO STAY
              </span>
            </div>
            <h1 className="font-monument text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">
              STAYS IN {currentAirport.city.toUpperCase()} ({hotelDestinationCode})
            </h1>
            <p className="text-xs sm:text-sm text-[#A5D1E1] mt-1 font-light">
              Browse sample properties. Confirm rates, amenities and arrival arrangements with the hotel before booking.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 font-mono text-xs">
            <div className="inline-flex items-center gap-2 bg-[#12484C] text-[#F2B632] border border-[#2B7574]/50 px-3.5 py-1.5 rounded-xl shadow-sm">
              <Zap className="w-3.5 h-3.5 text-emerald-400" />
              <span>Example amenities vary by property</span>
            </div>
            <span className="text-[11px] text-[#A5D1E1]/70">
              Check transfer options with the hotel
            </span>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-3 mt-6 items-center">
          <div className="sm:col-span-4 border border-[#2B7574]/40 rounded-2xl p-3 bg-[#061216]/60">
            <label className="block text-[10px] font-mono uppercase text-[#A5D1E1]">
              Destination City
            </label>
            <select
              value={hotelDestinationCode}
              onChange={(e) => setHotelSearch({ hotelDestinationCode: e.target.value })}
              className="w-full bg-transparent font-bold text-sm text-white focus:outline-none cursor-pointer mt-0.5"
            >
              {AIRPORTS.map((a) => (
                <option key={a.code} value={a.code} className="text-[#0E2931]">
                  {a.city} ({a.code})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3 border border-[#2B7574]/40 rounded-2xl p-3 bg-[#061216]/60">
            <label className="block text-[10px] font-mono uppercase text-[#A5D1E1]">
              Check-in Date
            </label>
            <input
              type="date"
              value={hotelCheckInDate}
              onChange={(e) => setHotelSearch({ hotelCheckInDate: e.target.value })}
              className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none mt-0.5"
            />
          </div>

          <div className="sm:col-span-3 border border-[#2B7574]/40 rounded-2xl p-3 bg-[#061216]/60">
            <label className="block text-[10px] font-mono uppercase text-[#A5D1E1]">
              Check-out Date
            </label>
            <input
              type="date"
              value={hotelCheckOutDate}
              onChange={(e) => setHotelSearch({ hotelCheckOutDate: e.target.value })}
              className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none mt-0.5"
            />
          </div>

          <div className="sm:col-span-2 border border-[#2B7574]/40 rounded-2xl p-3 bg-[#061216]/60 text-center">
            <label className="block text-[10px] font-mono uppercase text-[#A5D1E1]">
              Duration
            </label>
            <span className="block text-sm font-bold font-mono text-[#F2B632] mt-0.5">
              {nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'}
            </span>
          </div>
        </div>

        {/* Quick Filter Amenity Pills */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5 mt-5 pt-4 border-t border-[#18363F] text-xs font-mono">
          <span className="text-[#A5D1E1]/70 text-[10px] uppercase">Filter by amenity:</span>

          <button
            onClick={() => setFilterGeneratorOnly(!filterGeneratorOnly)}
            className={`px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 cursor-pointer ${
              filterGeneratorOnly
                ? 'bg-[#12484C] text-[#F2B632] border-[#F2B632]/50 font-bold'
                : 'border-white/10 bg-white/5 text-[#A5D1E1]'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Backup power</span>
          </button>

          <button
            onClick={() => setFilterAirportPickup(!filterAirportPickup)}
            className={`px-3 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 cursor-pointer ${
              filterAirportPickup
                ? 'bg-[#12484C] text-[#F2B632] border-[#F2B632]/50 font-bold'
                : 'border-white/10 bg-white/5 text-[#A5D1E1]'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-[#F2B632]" />
            <span>Airport pickup</span>
          </button>
        </div>
      </div>

      {/* Sanctuary Showcase Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {hotels.map((hotel) => {
          const imgAsset = HOTEL_IMAGES[hotel.id] || HOTEL_IMAGES['hotel-eko-grand'];
          const totalStayCost = hotel.pricePerNightNgn * nightsCount;

          return (
            <div
              key={hotel.id}
              className="rounded-3xl bg-white dark:bg-[#0E2931]/90 border border-[#2B7574]/30 hover:-translate-y-2 hover:shadow-[0_25px_50px_-15px_rgba(18,72,76,0.35)] hover:border-[#F2B632]/50 transition-all duration-500 overflow-hidden flex flex-col justify-between group relative"
            >
              {/* Image Surface with Subtle Vignette */}
              <div className="relative h-64 w-full bg-[#12484C] overflow-hidden">
                <img
                  src={imgAsset.src}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = imgAsset.fallback;
                  }}
                  alt={hotel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E2931] via-transparent to-black/30" />

                {hotel.featuredTag && (
                  <div className="absolute top-4 left-4 bg-[#09171C]/90 backdrop-blur-md border border-[#2B7574]/50 text-[#F2B632] px-3 py-1 rounded-full text-xs font-mono font-bold shadow-md">
                    {hotel.featuredTag}
                  </div>
                )}

                <div className="absolute top-4 right-4 bg-[#09171C]/90 backdrop-blur-md text-[#F4F6F5] px-3 py-1 rounded-full text-xs font-mono flex items-center gap-1.5 shadow-md">
                  <Star className="w-3.5 h-3.5 text-[#F2B632] fill-[#F2B632]" />
                  <span className="font-bold text-white">{hotel.reviewScore}</span>
                  <span className="text-[10px] text-[#A5D1E1]">({hotel.reviewCount} reviews)</span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-mono">
                  <div className="flex items-center gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full">
                    <MapPin className="w-3.5 h-3.5 text-[#F2B632]" />
                    <span>{hotel.district}, {hotel.city}</span>
                  </div>
                  <span className="bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[11px] text-[#A5D1E1]">
                    {hotel.distanceFromAirportKm} km to {currentAirport.code}
                  </span>
                </div>
              </div>

              {/* Content Description & Amenities */}
              <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-5">
                <div className="space-y-2.5">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase">
                    {hotel.name}
                  </h3>
                  <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] line-clamp-2 leading-relaxed font-light">
                    {hotel.overview}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {hotel.amenities.hasGeneratorBackup && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-500/10 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Backup power</span>
                      </span>
                    )}
                    {hotel.amenities.hasAirportPickup && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#12484C]/10 dark:bg-[#12484C]/60 text-[11px] font-mono text-[#12484C] dark:text-[#F2B632] border border-[#2B7574]/30">
                        <Car className="w-3.5 h-3.5 text-[#F2B632]" />
                        <span>Airport pickup</span>
                      </span>
                    )}
                    {hotel.amenities.hasHighSpeedWifi && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-cyan-500/10 text-[11px] font-mono text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                        <Wifi className="w-3.5 h-3.5" />
                        <span>High-Speed Wi-Fi</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="border-t border-[#E2E2E0] dark:border-[#18363F] pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="block text-[11px] font-mono uppercase text-[#2B7574] dark:text-[#A5D1E1]">
                      {nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'} Total:
                    </span>
                    <span className="text-2xl font-extrabold font-mono tabular-nums text-[#0E2931] dark:text-[#F2B632]">
                      {formatPrice(totalStayCost, currency)}
                    </span>
                    <span className="block text-[10px] text-[#12484C]/70 dark:text-[#A5D1E1]/70 font-mono">
                      ({formatPrice(hotel.pricePerNightNgn, currency)} / night)
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedHotel(hotel);
                      setActiveRoute('/flights/book');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="btn-gold py-3 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg group/btn"
                  >
                    <span>Reserve Suite</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
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
