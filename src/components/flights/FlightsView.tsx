import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { getFlights } from '../../services/apiServices';
import { Flight, AIRPORTS } from '../../data/mockData';
import { formatPrice } from '../../services/currency';
import {
  Plane,
  ArrowRightLeft,
  Calendar,
  Clock,
  Filter,
  TrendingUp,
  AlertCircle,
  Check,
  ShieldCheck,
  Search,
  Sparkles,
  Wifi,
  Coffee,
  Tv,
  Zap,
  ArrowRight,
  ChevronDown,
  Compass,
} from 'lucide-react';
import { RevealOnScroll } from '../common/RevealOnScroll';

export const FlightsView: React.FC = () => {
  const {
    originCode,
    destinationCode,
    departureDate,
    returnDate,
    tripType,
    cabinClass,
    setFlightSearch,
    setSelectedFlight,
    setActiveRoute,
    currency,
  } = useAppStore();

  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'best' | 'cheapest' | 'fastest'>('best');
  const [stopsFilter, setStopsFilter] = useState<number | 'all'>('all');
  const [airlineFilter, setAirlineFilter] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(3_500_000);
  const [selectedDayOffset, setSelectedDayOffset] = useState<number>(0);

  // Price change timer countdown simulation
  const [timerSeconds, setTimerSeconds] = useState(874);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 900));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Load flights matching current search
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    getFlights({
      originCode,
      destinationCode,
      cabinClass,
      stopsFilter,
      sortBy,
      maxPriceNgn: maxPrice,
    }).then((data) => {
      if (!isCancelled) {
        let filtered = data;
        if (airlineFilter !== 'all') {
          filtered = filtered.filter((f) => f.airline.toLowerCase().includes(airlineFilter.toLowerCase()));
        }
        setFlights(filtered);
        setLoading(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [originCode, destinationCode, cabinClass, stopsFilter, sortBy, maxPrice, airlineFilter]);

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    setActiveRoute('/flights/book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const originAirport = AIRPORTS.find((a) => a.code === originCode) || AIRPORTS[0];
  const destAirport = AIRPORTS.find((a) => a.code === destinationCode) || AIRPORTS[1];

  // 7-day lowest price calendar simulation
  const dateMatrix = [
    { day: 'Mon', date: 'Nov 10', price: 128500 },
    { day: 'Tue', date: 'Nov 11', price: 135000 },
    { day: 'Wed', date: 'Nov 12', price: 132000, isSelected: selectedDayOffset === 0 },
    { day: 'Thu', date: 'Nov 13', price: 148000 },
    { day: 'Fri', date: 'Nov 14', price: 165000 },
    { day: 'Sat', date: 'Nov 15', price: 142000 },
    { day: 'Sun', date: 'Nov 16', price: 139000 },
  ];

  return (
    <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Editorial Corridor Header & Telemetry */}
      <div className="bg-[#09171C] text-white rounded-3xl p-6 sm:p-8 border border-[#2B7574]/40 shadow-2xl relative overflow-hidden">
        <div className="bg-topo absolute inset-0 opacity-20 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#18363F]">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono tracking-widest text-[#F2B632] uppercase">
                GDS AIRSPACE CORRIDOR // VERIFIED INVENTORY
              </span>
            </div>
            <h1 className="font-monument text-2xl sm:text-4xl font-extrabold uppercase tracking-tight text-white flex items-center gap-3">
              <span>{originAirport.city} ({originCode})</span>
              <ArrowRight className="w-6 h-6 text-[#F2B632] stroke-[2.5]" />
              <span>{destAirport.city} ({destinationCode})</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#A5D1E1] mt-1 font-light">
              Direct carrier connection · Guaranteed seat availability · 0% ticketing markups
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-2 font-mono text-xs">
            <div className="inline-flex items-center gap-2 bg-[#861211]/30 text-rose-300 border border-rose-500/30 px-3.5 py-1.5 rounded-xl">
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>Fare Lock Expires in {formatTimer(timerSeconds)}</span>
            </div>
            <span className="text-[11px] text-[#A5D1E1]/70">
              VAT & Continental Departure Taxes Included
            </span>
          </div>
        </div>

        {/* Airport Selectors & Search Console */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-3 mt-6 items-center">
          {/* Trip Type & Cabin Class Pills */}
          <div className="md:col-span-12 flex flex-wrap items-center justify-between gap-3 pb-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFlightSearch({ tripType: 'round-trip' })}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                  tripType === 'round-trip'
                    ? 'bg-[#F2B632] text-[#0E2931] font-bold'
                    : 'bg-white/5 text-[#A5D1E1] hover:bg-white/10'
                }`}
              >
                Round-trip
              </button>
              <button
                onClick={() => setFlightSearch({ tripType: 'one-way' })}
                className={`px-3 py-1 rounded-lg cursor-pointer transition-colors ${
                  tripType === 'one-way'
                    ? 'bg-[#F2B632] text-[#0E2931] font-bold'
                    : 'bg-white/5 text-[#A5D1E1] hover:bg-white/10'
                }`}
              >
                One-way
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[#A5D1E1]/70">Class:</span>
              <select
                value={cabinClass}
                onChange={(e) =>
                  setFlightSearch({
                    cabinClass: e.target.value as 'Economy' | 'Business' | 'First',
                  })
                }
                className="bg-[#12484C] border border-[#2B7574]/50 rounded-lg px-3 py-1 text-xs text-[#F2B632] font-bold focus:outline-none cursor-pointer"
              >
                <option value="Economy">Economy (Vanguard)</option>
                <option value="Business">Executive Business</option>
                <option value="First">Royal First Sovereign</option>
              </select>
            </div>
          </div>

          {/* Origin */}
          <div className="md:col-span-3 border border-[#2B7574]/40 rounded-2xl p-3 bg-[#061216]/60">
            <label className="block text-[10px] font-mono uppercase text-[#A5D1E1]">
              Departure Airport
            </label>
            <select
              value={originCode}
              onChange={(e) => setFlightSearch({ originCode: e.target.value })}
              className="w-full bg-transparent font-bold text-sm text-white focus:outline-none cursor-pointer mt-0.5"
            >
              {AIRPORTS.map((a) => (
                <option key={a.code} value={a.code} className="text-[#0E2931]">
                  {a.city} ({a.code})
                </option>
              ))}
            </select>
          </div>

          {/* Swap */}
          <div className="md:col-span-1 flex justify-center">
            <button
              onClick={() =>
                setFlightSearch({
                  originCode: destinationCode,
                  destinationCode: originCode,
                })
              }
              aria-label="Swap airports"
              className="w-9 h-9 rounded-full bg-[#12484C] text-[#F2B632] border border-[#2B7574] flex items-center justify-center hover:rotate-180 transition-transform cursor-pointer shadow-md"
            >
              <ArrowRightLeft className="w-4 h-4 stroke-[2]" />
            </button>
          </div>

          {/* Destination */}
          <div className="md:col-span-3 border border-[#2B7574]/40 rounded-2xl p-3 bg-[#061216]/60">
            <label className="block text-[10px] font-mono uppercase text-[#A5D1E1]">
              Arrival Destination
            </label>
            <select
              value={destinationCode}
              onChange={(e) => setFlightSearch({ destinationCode: e.target.value })}
              className="w-full bg-transparent font-bold text-sm text-white focus:outline-none cursor-pointer mt-0.5"
            >
              {AIRPORTS.map((a) => (
                <option key={a.code} value={a.code} className="text-[#0E2931]">
                  {a.city} ({a.code})
                </option>
              ))}
            </select>
          </div>

          {/* Departure Date */}
          <div className="md:col-span-2 border border-[#2B7574]/40 rounded-2xl p-3 bg-[#061216]/60">
            <label className="block text-[10px] font-mono uppercase text-[#A5D1E1]">
              Depart Date
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setFlightSearch({ departureDate: e.target.value })}
              className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none mt-0.5"
            />
          </div>

          {/* Return Date */}
          <div className="md:col-span-2 border border-[#2B7574]/40 rounded-2xl p-3 bg-[#061216]/60">
            <label className="block text-[10px] font-mono uppercase text-[#A5D1E1]">
              Return Date
            </label>
            <input
              type="date"
              value={returnDate}
              disabled={tripType === 'one-way'}
              onChange={(e) => setFlightSearch({ returnDate: e.target.value })}
              className="w-full bg-transparent text-xs font-semibold text-white focus:outline-none mt-0.5 disabled:opacity-30"
            />
          </div>

          {/* Search Trigger */}
          <div className="md:col-span-1">
            <button
              onClick={() => {
                setLoading(true);
                getFlights({
                  originCode,
                  destinationCode,
                  cabinClass,
                  stopsFilter,
                  sortBy,
                }).then((data) => {
                  setFlights(data);
                  setLoading(false);
                });
              }}
              aria-label="Search"
              className="btn-gold w-full h-12 rounded-2xl flex items-center justify-center cursor-pointer shadow-lg"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* 7-Day Fare Horizon Matrix */}
        <div className="relative z-10 mt-6 pt-5 border-t border-[#18363F]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A5D1E1]/70 block mb-2.5">
            LOWEST CORRIDOR FARES THIS WEEK:
          </span>
          <div className="grid grid-cols-7 gap-2 overflow-x-auto no-scrollbar">
            {dateMatrix.map((item, idx) => (
              <button
                key={item.date}
                onClick={() => setSelectedDayOffset(idx)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                  selectedDayOffset === idx
                    ? 'bg-[#12484C] border-[#F2B632] text-white shadow-md'
                    : 'bg-white/5 border-white/5 hover:bg-white/10 text-[#A5D1E1]'
                }`}
              >
                <span className="block text-[10px] font-mono text-[#A5D1E1]/70">{item.day} · {item.date}</span>
                <span className={`block font-mono text-xs font-bold mt-0.5 ${selectedDayOffset === idx ? 'text-[#F2B632]' : 'text-white'}`}>
                  {formatPrice(item.price, currency)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Results Layout: Filters Sidebar + Results List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar (col-span-3) */}
        <aside className="lg:col-span-3 space-y-6 bg-white dark:bg-[#0E2931]/80 rounded-3xl p-6 border border-[#2B7574]/30 shadow-teal-soft">
          <div className="flex items-center justify-between pb-4 border-b border-[#E2E2E0] dark:border-[#18363F]">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#F2B632]" />
              <h3 className="font-display text-sm font-bold uppercase text-[#0E2931] dark:text-[#FFFFFF]">
                Filters
              </h3>
            </div>
            <button
              onClick={() => {
                setStopsFilter('all');
                setAirlineFilter('all');
                setMaxPrice(3500000);
              }}
              className="text-[11px] font-mono text-[#2B7574] dark:text-[#A5D1E1] hover:underline cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Stops */}
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-[#12484C] dark:text-[#A5D1E1] block font-bold">
              Flight Stops
            </span>
            <div className="space-y-1.5 text-xs text-[#0E2931] dark:text-[#EAEFEF]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="stops"
                  checked={stopsFilter === 'all'}
                  onChange={() => setStopsFilter('all')}
                  className="accent-[#F2B632]"
                />
                <span>All Connections</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="stops"
                  checked={stopsFilter === 0}
                  onChange={() => setStopsFilter(0)}
                  className="accent-[#F2B632]"
                />
                <span>Non-Stop Direct Only</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="stops"
                  checked={stopsFilter === 1}
                  onChange={() => setStopsFilter(1)}
                  className="accent-[#F2B632]"
                />
                <span>1 Stop Transit Max</span>
              </label>
            </div>
          </div>

          {/* Carrier Airline */}
          <div className="space-y-2 pt-4 border-t border-[#E2E2E0] dark:border-[#18363F]">
            <span className="text-xs font-mono uppercase tracking-wider text-[#12484C] dark:text-[#A5D1E1] block font-bold">
              Operating Carrier
            </span>
            <select
              value={airlineFilter}
              onChange={(e) => setAirlineFilter(e.target.value)}
              className="w-full bg-[#F4F6F5] dark:bg-[#061216] border border-[#2B7574]/30 rounded-xl px-3 py-2 text-xs font-mono text-[#0E2931] dark:text-[#FFFFFF] focus:outline-none"
            >
              <option value="all">All Partner Carriers</option>
              <option value="aerovista">Aerovista Royal</option>
              <option value="zenith">Zenith Airways</option>
              <option value="equatorial">Equatorial Air</option>
              <option value="savannah">Savannah Wings</option>
            </select>
          </div>

          {/* Maximum Price Slider */}
          <div className="space-y-2 pt-4 border-t border-[#E2E2E0] dark:border-[#18363F]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold uppercase text-[#12484C] dark:text-[#A5D1E1]">Max Fare</span>
              <span className="font-bold text-[#F2B632]">{formatPrice(maxPrice, currency)}</span>
            </div>
            <input
              type="range"
              min={100000}
              max={3500000}
              step={50000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#F2B632] cursor-pointer"
            />
          </div>

          {/* Sovereign Guarantee Box */}
          <div className="p-4 rounded-2xl bg-[#12484C]/10 dark:bg-[#12484C]/30 border border-[#2B7574]/30 text-xs font-mono space-y-2">
            <div className="flex items-center gap-1.5 text-[#F2B632] font-bold uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>GDS Price Integrity</span>
            </div>
            <p className="text-[11px] text-[#2B7574] dark:text-[#A5D1E1]/80 leading-relaxed">
              Ticket issuance is sealed cryptographically directly with the carrier. Zero surcharge markups.
            </p>
          </div>
        </aside>

        {/* Results List (col-span-9) */}
        <main className="lg:col-span-9 space-y-5">
          {/* Sort Control Tabs */}
          <div className="bg-white dark:bg-[#0E2931]/80 rounded-2xl p-2 border border-[#2B7574]/30 shadow-teal-soft flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 text-xs font-mono">
              <button
                onClick={() => setSortBy('best')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  sortBy === 'best'
                    ? 'bg-[#12484C] text-[#F2B632] font-bold shadow-sm'
                    : 'text-[#12484C] dark:text-[#A5D1E1] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                Best Value
              </button>
              <button
                onClick={() => setSortBy('cheapest')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  sortBy === 'cheapest'
                    ? 'bg-[#12484C] text-[#F2B632] font-bold shadow-sm'
                    : 'text-[#12484C] dark:text-[#A5D1E1] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                Cheapest Fares
              </button>
              <button
                onClick={() => setSortBy('fastest')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  sortBy === 'fastest'
                    ? 'bg-[#12484C] text-[#F2B632] font-bold shadow-sm'
                    : 'text-[#12484C] dark:text-[#A5D1E1] hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                Fastest Duration
              </button>
            </div>

            <span className="font-mono text-xs text-[#2B7574] dark:text-[#A5D1E1] pr-3 hidden sm:inline">
              Showing <strong>{flights.length}</strong> Flights
            </span>
          </div>

          {/* Shimmer Skeletons during Loading */}
          {loading && (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-44 rounded-3xl bg-white dark:bg-[#0E2931]/60 border border-[#2B7574]/20 p-6 flex flex-col justify-between"
                >
                  <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-800 rounded" />
                  <div className="h-10 w-full bg-gray-100 dark:bg-gray-800/60 rounded" />
                  <div className="h-8 w-1/4 bg-gray-200 dark:bg-gray-800 rounded self-end" />
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && flights.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-[#0E2931]/60 rounded-3xl border border-[#2B7574]/30 p-8 space-y-3">
              <AlertCircle className="w-10 h-10 text-[#F2B632] mx-auto stroke-[1.5]" />
              <h3 className="font-display text-xl font-bold text-[#0E2931] dark:text-[#FFFFFF] uppercase">
                No Direct Flights Found for This Query
              </h3>
              <p className="text-xs text-[#12484C]/80 dark:text-[#A5D1E1] max-w-sm mx-auto">
                Try switching origin or destination to Lagos (LOS) or adjusting max fare filters.
              </p>
              <button
                onClick={() => {
                  setFlightSearch({ originCode: 'LOS', destinationCode: 'ABV' });
                }}
                className="btn-gold px-4 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer"
              >
                Reset to Lagos → Abuja Route
              </button>
            </div>
          )}

          {/* Flights Inventory List */}
          {!loading &&
            flights.map((flight) => {
              const orig = AIRPORTS.find((a) => a.code === flight.origin) || originAirport;
              const dest = AIRPORTS.find((a) => a.code === flight.destination) || destAirport;
              const monthlyLoan = Math.round(flight.priceNgn / 6);

              return (
                <div
                  key={flight.id}
                  className="rounded-3xl bg-white dark:bg-[#0E2931]/90 border border-[#2B7574]/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#F2B632]/50 p-6 group flex flex-col justify-between gap-5 relative overflow-hidden"
                >
                  {/* Subtle Top Gold Laser Accent on Hover */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F2B632] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Top Bar: Carrier info & Score */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#12484C] text-[#F2B632] flex items-center justify-center shadow-md">
                        <Plane className="w-5 h-5 stroke-[1.75] -rotate-45" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-display text-base font-bold text-[#0E2931] dark:text-[#FFFFFF] tracking-wider uppercase">
                            {flight.airline}
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#12484C]/20 dark:bg-[#12484C]/60 text-[#F2B632] border border-[#2B7574]/40 font-bold">
                            {flight.cabinClass}
                          </span>
                        </div>
                        <span className="block font-mono text-[10px] text-[#2B7574] dark:text-[#A5D1E1] mt-0.5">
                          Flight {flight.flightNumber} · {flight.aircraft}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {flight.priceTrend === 'rising' && (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full font-bold">
                          <TrendingUp className="w-3 h-3 stroke-[2]" />
                          <span>Fares Rising</span>
                        </span>
                      )}

                      <span className="font-mono text-xs font-bold text-[#12484C] dark:text-[#F2B632] bg-[#12484C]/15 dark:bg-[#12484C]/80 px-2.5 py-1 rounded-full border border-[#2B7574]/30">
                        ★ {flight.score} Score
                      </span>
                    </div>
                  </div>

                  {/* Flight Times & Duration Visualization */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center py-2">
                    {/* Departure */}
                    <div className="sm:col-span-3">
                      <span className="font-mono text-2xl font-bold tabular-nums text-[#0E2931] dark:text-[#FFFFFF] block">
                        {flight.departureTime}
                      </span>
                      <span className="block text-xs font-bold text-[#12484C] dark:text-[#A5D1E1]">
                        {orig.city} ({flight.origin})
                      </span>
                      <span className="block text-[10px] text-[#2B7574] dark:text-[#A5D1E1]/70 truncate">
                        {orig.name}
                      </span>
                    </div>

                    {/* Flight Path Graphic */}
                    <div className="sm:col-span-6 flex flex-col items-center">
                      <span className="font-mono text-[11px] text-[#2B7574] dark:text-[#A5D1E1] mb-1 font-semibold">
                        {flight.duration} · {flight.stops === 0 ? 'Non-Stop Direct' : '1 Transit Stop'}
                      </span>
                      <div className="w-full h-0.5 bg-[#2B7574]/30 relative flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#12484C] dark:bg-[#F2B632] absolute left-0" />
                        <Plane className="w-4 h-4 text-[#F2B632] transform rotate-90 stroke-[2.5]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#12484C] dark:bg-[#F2B632] absolute right-0" />
                      </div>
                      <span className="font-mono text-[10px] text-[#12484C]/70 dark:text-[#A5D1E1]/70 mt-1 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Carbon Offset: {flight.co2Kg} kg CO₂</span>
                      </span>
                    </div>

                    {/* Arrival */}
                    <div className="sm:col-span-3 text-left sm:text-right">
                      <span className="font-mono text-2xl font-bold tabular-nums text-[#0E2931] dark:text-[#FFFFFF] block">
                        {flight.arrivalTime}
                      </span>
                      <span className="block text-xs font-bold text-[#12484C] dark:text-[#A5D1E1]">
                        {dest.city} ({flight.destination})
                      </span>
                      <span className="block text-[10px] text-[#2B7574] dark:text-[#A5D1E1]/70 truncate">
                        {dest.name}
                      </span>
                    </div>
                  </div>

                  {/* Flight Amenities & Perks */}
                  <div className="flex flex-wrap items-center gap-4 text-[11px] font-mono text-[#2B7574] dark:text-[#A5D1E1] pt-2 border-t border-[#E2E2E0] dark:border-[#18363F]">
                    <div className="flex items-center gap-1.5">
                      <Wifi className="w-3.5 h-3.5 text-[#F2B632]" />
                      <span>Starlink Airborne Wi-Fi</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Coffee className="w-3.5 h-3.5 text-[#F2B632]" />
                      <span>Complimentary Dining</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Tv className="w-3.5 h-3.5 text-[#F2B632]" />
                      <span>4K In-Flight Media</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold ml-auto">
                      <Zap className="w-3.5 h-3.5" />
                      <span>Fly Now Pay Later: {formatPrice(monthlyLoan, currency)}/mo</span>
                    </div>
                  </div>

                  {/* Bottom Action Bar: Price + Booking Trigger */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#E2E2E0] dark:border-[#18363F]">
                    <div>
                      <span className="text-[10px] font-mono uppercase text-[#2B7574] dark:text-[#A5D1E1] block">
                        Direct Carrier Fare
                      </span>
                      <span className="font-mono text-2xl sm:text-3xl font-extrabold text-[#0E2931] dark:text-[#F2B632] tabular-nums">
                        {formatPrice(flight.priceNgn, currency)}
                      </span>
                      <span className="text-[10px] text-[#2B7574] dark:text-[#A5D1E1]/70 block">
                        Taxes & Baggage (2 × 32kg) Included
                      </span>
                    </div>

                    <button
                      onClick={() => handleSelectFlight(flight)}
                      className="btn-gold py-3 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg group/btn"
                    >
                      <span>Select Flight & Configure Seats</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
        </main>
      </div>
    </div>
  );
};
