import React, { useMemo, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_FLIGHTS } from '../../data/mockData';
import { formatPrice } from '../../services/currency';
import { ArrowUpRight, ArrowRight, Plane, TrendingDown, TrendingUp, Minus, Info } from 'lucide-react';

type SortKey = 'price' | 'duration' | 'score';

/** "7h 30m" → 450 minutes */
function durationToMinutes(duration: string): number {
  const hours = /(\d+)\s*h/.exec(duration);
  const minutes = /(\d+)\s*m/.exec(duration);
  return (hours ? Number(hours[1]) * 60 : 0) + (minutes ? Number(minutes[1]) : 0);
}

const SORTS: { id: SortKey; label: string }[] = [
  { id: 'price', label: 'Lowest fare' },
  { id: 'duration', label: 'Shortest hop' },
  { id: 'score', label: 'Best rated' },
];

/** Micro-label shown only on stacked (mobile) rows where the table header is hidden. */
const MicroLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="mb-0.5 block text-[8.5px] font-mono font-bold uppercase tracking-[0.16em] text-[#8A9DA3] dark:text-[#5E7B84] lg:hidden">
    {children}
  </span>
);

export const FareBoardSection: React.FC = () => {
  const { currency, setSelectedFlight, setActiveRoute, setFlightSearch } = useAppStore();
  const [sort, setSort] = useState<SortKey>('price');
  const [directOnly, setDirectOnly] = useState(false);

  const rows = useMemo(() => {
    const pool = directOnly ? MOCK_FLIGHTS.filter((flight) => flight.stops === 0) : MOCK_FLIGHTS;
    return [...pool].sort((a, b) => {
      if (sort === 'price') return a.priceNgn - b.priceNgn;
      if (sort === 'duration') return durationToMinutes(a.duration) - durationToMinutes(b.duration);
      return b.score - a.score;
    });
  }, [sort, directOnly]);

  const cheapest = useMemo(
    () => Math.min(...MOCK_FLIGHTS.map((flight) => flight.priceNgn)),
    [],
  );

  const openFlight = (flightId: string) => {
    const flight = MOCK_FLIGHTS.find((item) => item.id === flightId) ?? null;
    if (!flight) return;
    setSelectedFlight(flight);
    setFlightSearch({ originCode: flight.origin, destinationCode: flight.destination, cabinClass: flight.cabinClass });
    setActiveRoute('/flights/book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="fare-board-section"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden"
    >
      <span aria-hidden="true" className="wm-text select-none">FARES</span>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-9">
          <div>
            <span className="text-xs font-mono tracking-widest text-[#2B7574] dark:text-[#F2B632] uppercase block mb-1">
              02. THE FARE BOARD · PUBLISHED THIS WEEK
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#0E2931] dark:text-[#EAEFEF] uppercase">
              Every corridor, one comparison table
            </h2>
            <p className="text-sm text-[#12484C]/80 dark:text-[#A5D1E1] mt-1 max-w-2xl">
              Instead of opening nine tabs, read the whole network here: lowest published fare,
              block time, carrier, seats left and whether the price is moving up or down.
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="flex items-center gap-1 rounded-xl border border-[#2B7574]/25 bg-white dark:bg-[#0E2931]/70 p-1">
              {SORTS.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSort(option.id)}
                  aria-pressed={sort === option.id}
                  className={`px-3 py-1.5 rounded-lg text-[10.5px] font-mono font-bold uppercase tracking-[0.08em] transition-colors cursor-pointer ${
                    sort === option.id
                      ? 'bg-[#12484C] text-[#F2B632]'
                      : 'text-[#5A6B70] dark:text-[#8FA9AF] hover:text-[#0E2931] dark:hover:text-[#EAEFEF]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => setDirectOnly((value) => !value)}
              aria-pressed={directOnly}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-[10.5px] font-mono font-bold uppercase tracking-[0.08em] transition-colors cursor-pointer ${
                directOnly
                  ? 'border-[#2B7574] bg-[#2B7574]/12 text-[#12484C] dark:text-[#F2B632]'
                  : 'border-[#2B7574]/25 bg-white dark:bg-[#0E2931]/70 text-[#5A6B70] dark:text-[#8FA9AF]'
              }`}
            >
              <span
                className={`grid h-3 w-3 place-items-center rounded-[3px] border ${
                  directOnly ? 'border-[#2B7574] bg-[#2B7574] dark:border-[#F2B632] dark:bg-[#F2B632]' : 'border-current'
                }`}
              >
                {directOnly && <span className="h-1 w-1.5 bg-white dark:bg-[#0E2931]" />}
              </span>
              Non-stop only
            </button>
          </div>
        </div>

        {/* Table shell */}
        <div className="rounded-2xl border border-[#2B7574]/25 bg-white dark:bg-[#0E2931]/70 overflow-hidden shadow-[0_20px_60px_-40px_rgba(18,72,76,0.6)]">
          {/* Desktop header */}
          <div className="hidden lg:grid grid-cols-[1.5fr_1.1fr_0.9fr_0.8fr_0.7fr_auto] items-center gap-4 px-6 py-3 border-b border-[#E2E2E0] dark:border-[#18363F] bg-[#F4F6F5]/70 dark:bg-[#061216]/50 text-[10px] font-mono font-bold uppercase tracking-[0.16em] text-[#2B7574] dark:text-[#A5D1E1]">
            <span>Route</span>
            <span>Carrier / flight</span>
            <span>Block time</span>
            <span>Seats left</span>
            <span className="text-right">Fare</span>
            <span className="w-[86px] text-right">Action</span>
          </div>

          <ul className="divide-y divide-[#E2E2E0] dark:divide-[#18363F]">
            {rows.map((flight) => {
              const isCheapest = flight.priceNgn === cheapest;
              const TrendIcon =
                flight.priceTrend === 'rising' ? TrendingUp : flight.priceTrend === 'falling' ? TrendingDown : Minus;
              const trendTone =
                flight.priceTrend === 'rising'
                  ? 'text-[#b4453f] dark:text-[#ff9b95]'
                  : flight.priceTrend === 'falling'
                    ? 'text-[#2B7574] dark:text-[#7fd4c1]'
                    : 'text-[#8A9DA3] dark:text-[#5E7B84]';

              return (
                <li
                  key={flight.id}
                  className="group grid grid-cols-3 lg:grid-cols-[1.5fr_1.1fr_0.9fr_0.8fr_0.7fr_auto] gap-x-3 gap-y-3 lg:gap-4 items-center px-5 sm:px-6 py-4 sm:py-[18px] hover:bg-[#2B7574]/[0.04] dark:hover:bg-[#F2B632]/[0.04] transition-colors"
                >
                  {/* Route */}
                  <div className="col-span-3 flex items-center gap-3 min-w-0 lg:col-span-1">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#12484C] text-[#F2B632]">
                      <Plane className="h-4 w-4 -rotate-45" strokeWidth={1.7} />
                    </div>
                    <div className="min-w-0">
                      <p className="flex items-center gap-1.5 text-[13.5px] font-semibold text-[#0E2931] dark:text-[#EAEFEF]">
                        {flight.originCity}
                        <ArrowRight className="h-3 w-3 text-[#8A9DA3] dark:text-[#5E7B84]" strokeWidth={2} />
                        {flight.destinationCity}
                      </p>
                      <p className="text-[10.5px] font-mono uppercase tracking-[0.12em] text-[#8A9DA3] dark:text-[#5E7B84]">
                        {flight.origin} → {flight.destination} · {flight.cabinClass}
                      </p>
                    </div>
                  </div>

                  {/* Carrier */}
                  <div className="col-span-3 min-w-0 lg:col-span-1">
                    <p className="truncate text-[12.5px] font-medium text-[#12484C] dark:text-[#A5D1E1]">
                      {flight.airline}
                    </p>
                    <p className="text-[10.5px] font-mono text-[#8A9DA3] dark:text-[#5E7B84]">
                      {flight.flightNumber} · {flight.aircraft}
                    </p>
                  </div>

                  {/* Duration */}
                  <div>
                    <MicroLabel>Block time</MicroLabel>
                    <p className="text-[12.5px] font-semibold tabular-nums text-[#0E2931] dark:text-[#EAEFEF]">
                      {flight.duration}
                    </p>
                    <p className="text-[10.5px] font-mono text-[#8A9DA3] dark:text-[#5E7B84]">
                      {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
                    </p>
                  </div>

                  {/* Seats */}
                  <div>
                    <MicroLabel>Seats left</MicroLabel>
                    <p
                      className={`text-[12.5px] font-semibold tabular-nums ${
                        flight.availableSeats <= 5
                          ? 'text-[#b4453f] dark:text-[#ff9b95]'
                          : 'text-[#0E2931] dark:text-[#EAEFEF]'
                      }`}
                    >
                      {flight.availableSeats} seats
                    </p>
                    <p className="text-[10.5px] font-mono text-[#8A9DA3] dark:text-[#5E7B84]">
                      {flight.availableSeats <= 5 ? 'Selling fast' : 'Available'}
                    </p>
                  </div>

                  {/* Fare */}
                  <div className="lg:text-right">
                    <MicroLabel>Fare</MicroLabel>
                    <p className="text-[15px] font-bold tabular-nums text-[#0E2931] dark:text-[#EAEFEF]">
                      {formatPrice(flight.priceNgn, currency)}
                    </p>
                    <p className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[0.08em] ${trendTone}`}>
                      <TrendIcon className="h-2.5 w-2.5" strokeWidth={2.4} />
                      {flight.priceTrend}
                      {isCheapest && (
                        <span className="ml-1 rounded-sm bg-[#F2B632]/20 px-1 py-[1px] text-[8px] font-bold text-[#7a5b12] dark:text-[#F2B632]">
                          Lowest
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Action */}
                  <div className="col-span-3 lg:col-span-1 lg:w-[86px] lg:text-right">
                    <button
                      onClick={() => openFlight(flight.id)}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-[#2B7574]/35 px-3 py-2 text-[10.5px] font-bold uppercase tracking-[0.08em] text-[#12484C] dark:text-[#F2B632] hover:bg-[#12484C] hover:text-[#F2B632] dark:hover:bg-[#F2B632] dark:hover:text-[#0E2931] transition-colors cursor-pointer lg:w-auto lg:py-1.5"
                    >
                      Select
                      <ArrowUpRight className="h-3 w-3" strokeWidth={2.2} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {rows.length === 0 && (
            <p className="px-6 py-10 text-center text-sm text-[#5A6B70] dark:text-[#8FA9AF]">
              No non-stop corridors match that filter yet. Turn it off to see connecting options.
            </p>
          )}

          {/* Footnote */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 sm:px-6 py-4 border-t border-[#E2E2E0] dark:border-[#18363F] bg-[#F4F6F5]/60 dark:bg-[#061216]/40">
            <p className="flex items-start gap-2 text-[10.5px] leading-4 text-[#8A9DA3] dark:text-[#5E7B84]">
              <Info className="mt-[1px] h-3 w-3 shrink-0" strokeWidth={1.8} />
              Sample published fares for comparison. Seat counts and prices are confirmed at checkout.
            </p>
            <button
              onClick={() => {
                setActiveRoute('/flights');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex shrink-0 items-center gap-1.5 text-[10.5px] font-mono font-bold uppercase tracking-[0.12em] text-[#2B7574] dark:text-[#F2B632] hover:opacity-70 transition-opacity cursor-pointer"
            >
              Open the full search
              <ArrowRight className="h-3 w-3" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
