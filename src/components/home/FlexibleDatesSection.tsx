import React, { useMemo, useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MOCK_FLIGHTS } from '../../data/mockData';
import { formatPrice } from '../../services/currency';
import { ArrowRight, CalendarDays, Sparkles, Info, Plane } from 'lucide-react';

const WINDOW_DAYS = 14;

/** Unique origin → destination pairs that actually have a published fare. */
const ROUTES = Array.from(
  new Map(
    MOCK_FLIGHTS.map((flight) => [
      `${flight.origin}-${flight.destination}`,
      {
        id: `${flight.origin}-${flight.destination}`,
        origin: flight.origin,
        destination: flight.destination,
        originCity: flight.originCity,
        destinationCity: flight.destinationCity,
        baseFareNgn: Math.min(
          ...MOCK_FLIGHTS.filter(
            (item) => item.origin === flight.origin && item.destination === flight.destination,
          ).map((item) => item.priceNgn),
        ),
      },
    ]),
  ).values(),
);

/** Stable pseudo-random 0..1 from a string — keeps day-on-day prices consistent between renders. */
function seededUnit(seed: string): number {
  let hash = 2166136261;
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return ((hash >>> 0) % 10000) / 10000;
}

function startOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function toIsoDate(date: Date): string {
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export const FlexibleDatesSection: React.FC = () => {
  const { currency, setFlightSearch, setActiveRoute } = useAppStore();

  const [routeId, setRouteId] = useState(ROUTES[0]?.id ?? '');

  const route = ROUTES.find((item) => item.id === routeId) ?? ROUTES[0];

  const days = useMemo(() => {
    if (!route) return [];
    const base = startOfToday();
    return Array.from({ length: WINDOW_DAYS }, (_, offset) => {
      const date = new Date(base);
      date.setDate(base.getDate() + offset);
      const iso = toIsoDate(date);
      const weekday = date.getDay();
      // Weekends and Fridays carry a premium; midweek carries a discount.
      const dayFactor = weekday === 0 || weekday === 5 ? 0.11 : weekday === 6 ? 0.07 : weekday === 2 || weekday === 3 ? -0.08 : 0;
      const noise = (seededUnit(`${route.id}-${iso}`) - 0.5) * 0.14;
      const fare = Math.round((route.baseFareNgn * (1 + dayFactor + noise)) / 500) * 500;
      return {
        iso,
        fare,
        weekday,
        dayNumber: date.getDate(),
        monthShort: date.toLocaleDateString('en-GB', { month: 'short' }),
        weekdayShort: date.toLocaleDateString('en-GB', { weekday: 'short' }),
        isWeekend: weekday === 0 || weekday === 6,
      };
    });
  }, [route]);

  const cheapestFare = days.length ? Math.min(...days.map((day) => day.fare)) : 0;
  const dearestFare = days.length ? Math.max(...days.map((day) => day.fare)) : 0;
  const savingNgn = dearestFare - cheapestFare;

  const handlePick = (iso: string) => {
    if (!route) return;
    setFlightSearch({ originCode: route.origin, destinationCode: route.destination, departureDate: iso });
    setActiveRoute('/flights');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section
      id="flexible-dates-section"
      className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E2E2E0] dark:border-[#18363F]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-9">
          <div className="max-w-2xl">
            <span className="text-xs font-mono tracking-widest text-[#2B7574] dark:text-[#F2B632] uppercase block mb-1">
              03. FLEXIBLE DATES · NEXT {WINDOW_DAYS} DAYS
            </span>
            <h2 className="text-2xl sm:text-4xl font-display font-bold text-[#0E2931] dark:text-[#EAEFEF] uppercase">
              Move the day, move the price
            </h2>
            <p className="text-sm text-[#12484C]/80 dark:text-[#A5D1E1] mt-1">
              Same route, different day, very different fare. Pick a corridor, then choose the
              cheapest departure in the next two weeks.
            </p>
          </div>

          {/* Route picker */}
          <div className="flex flex-col gap-2 shrink-0">
            <label
              htmlFor="flex-route"
              className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#2B7574] dark:text-[#A5D1E1]"
            >
              Corridor
            </label>
            <div className="relative">
              <select
                id="flex-route"
                value={route?.id ?? ''}
                onChange={(event) => setRouteId(event.target.value)}
                className="appearance-none w-full sm:w-[290px] rounded-xl border border-[#2B7574]/30 bg-white dark:bg-[#0E2931]/70 pl-10 pr-9 py-3 text-[12.5px] font-semibold text-[#0E2931] dark:text-[#EAEFEF] outline-none focus:border-[#2B7574] dark:focus:border-[#F2B632] transition-colors cursor-pointer"
              >
                {ROUTES.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.originCity} ({option.origin}) → {option.destinationCity} ({option.destination})
                  </option>
                ))}
              </select>
              <Plane
                className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 -rotate-45 text-[#2B7574] dark:text-[#F2B632]"
                strokeWidth={1.7}
              />
              <CalendarDays
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9DA3] dark:text-[#5E7B84]"
                strokeWidth={1.7}
              />
            </div>
          </div>
        </div>

        {/* Hero stat strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {[
            { label: 'Lowest fare in window', value: formatPrice(cheapestFare, currency), tone: 'gold' },
            { label: 'Highest fare in window', value: formatPrice(dearestFare, currency), tone: 'plain' },
            { label: 'You can save by shifting a day', value: formatPrice(savingNgn, currency), tone: 'teal' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[#2B7574]/25 bg-white dark:bg-[#0E2931]/70 px-4 py-3.5"
            >
              <p className="text-[9.5px] font-mono font-bold uppercase tracking-[0.16em] text-[#2B7574] dark:text-[#A5D1E1]">
                {stat.label}
              </p>
              <p
                className={`mt-1 text-lg font-bold tabular-nums ${
                  stat.tone === 'gold'
                    ? 'text-[#8a6516] dark:text-[#F2B632]'
                    : stat.tone === 'teal'
                      ? 'text-[#2B7574] dark:text-[#7fd4c1]'
                      : 'text-[#0E2931] dark:text-[#EAEFEF]'
                }`}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Day strip */}
        <div className="rounded-2xl border border-[#2B7574]/25 bg-white dark:bg-[#0E2931]/70 p-3 sm:p-4 overflow-x-auto no-scrollbar">
          <div className="flex gap-2 min-w-max">
            {days.map((day) => {
              const isCheapest = day.fare === cheapestFare;
              return (
                <button
                  key={day.iso}
                  onClick={() => handlePick(day.iso)}
                  className={`relative w-[78px] sm:w-[88px] shrink-0 rounded-xl border px-2 py-3 text-center transition-colors cursor-pointer ${
                    isCheapest
                      ? 'border-[#F2B632] bg-[#F2B632]/12 dark:bg-[#F2B632]/15'
                      : day.isWeekend
                        ? 'border-[#2B7574]/25 bg-[#2B7574]/[0.05] dark:bg-[#2B7574]/10 hover:border-[#2B7574]/50'
                        : 'border-[#E2E2E0] dark:border-[#18363F] hover:border-[#2B7574]/45'
                  }`}
                >
                  {isCheapest && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-sm bg-[#F2B632] px-1.5 py-[1px] text-[7.5px] font-bold uppercase tracking-[0.1em] text-[#0E2931] whitespace-nowrap">
                      Cheapest
                    </span>
                  )}
                  <span className="block text-[9px] font-mono uppercase tracking-[0.12em] text-[#8A9DA3] dark:text-[#5E7B84]">
                    {day.weekdayShort}
                  </span>
                  <span className="mt-0.5 block text-[17px] font-display font-bold leading-none text-[#0E2931] dark:text-[#EAEFEF]">
                    {day.dayNumber}
                  </span>
                  <span className="block text-[8.5px] font-mono uppercase tracking-[0.12em] text-[#8A9DA3] dark:text-[#5E7B84]">
                    {day.monthShort}
                  </span>
                  <span
                    className={`mt-2 block border-t pt-2 text-[10.5px] font-bold tabular-nums ${
                      isCheapest
                        ? 'border-[#F2B632]/40 text-[#8a6516] dark:text-[#F2B632]'
                        : 'border-[#E2E2E0] dark:border-[#18363F] text-[#12484C] dark:text-[#A5D1E1]'
                    }`}
                  >
                    {formatPrice(day.fare, currency, { compact: true })}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer row */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="flex items-start gap-2 max-w-2xl text-[11px] leading-5 text-[#8A9DA3] dark:text-[#5E7B84]">
            <Info className="mt-[2px] h-3 w-3 shrink-0" strokeWidth={1.8} />
            Indicative fares modelled from published sample data to show how weekday choice changes
            price. Final fare and availability are confirmed when you search.
          </p>
          <button
            onClick={() => {
              if (!route) return;
              setFlightSearch({ originCode: route.origin, destinationCode: route.destination });
              setActiveRoute('/flights');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#12484C] px-4 py-2.5 text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#F2B632] hover:bg-[#0E2931] transition-colors cursor-pointer"
          >
            <Sparkles className="h-3.5 w-3.5" strokeWidth={2} />
            Search every date on this route
            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
          </button>
        </div>
      </div>
    </section>
  );
};
