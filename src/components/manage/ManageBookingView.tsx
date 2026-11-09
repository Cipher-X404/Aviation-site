import React, { useMemo, useState } from 'react';
import { useAppStore, type BookingRecord } from '../../store/useAppStore';
import { MOCK_FLIGHTS, AIRPORTS } from '../../data/mockData';
import { formatPrice } from '../../services/currency';
import {
  calculateRefund, calculateChangeQuote, describeCountdown, hoursUntilDeparture,
  REFUND_POLICY_TIERS,
} from '../../config/bookingLifecycle';
import {
  ArrowLeft, ArrowRight, Calendar, CheckCircle2, ChevronRight, Clock, Info,
  Plane, RotateCcw, Search, ShieldAlert, Ticket, TriangleAlert, XCircle,
} from 'lucide-react';

type Mode = 'retrieve' | 'overview' | 'cancel' | 'change' | 'done';

interface DoneState {
  kind: 'cancelled' | 'changed';
  bookingRef: string;
  refundNgn?: number;
  amountDueNgn?: number;
  newFlightLabel?: string;
}

const Field: React.FC<{ label: string; value: React.ReactNode; mono?: boolean }> = ({ label, value, mono }) => (
  <div>
    <span className="block text-[9.5px] font-mono uppercase tracking-[0.16em] text-[#8A9DA3] dark:text-[#5E7B84]">
      {label}
    </span>
    <span className={`mt-0.5 block text-[13px] font-semibold text-[#0E2931] dark:text-[#EAEFEF] ${mono ? 'font-mono tabular-nums' : ''}`}>
      {value}
    </span>
  </div>
);

export const ManageBookingView: React.FC = () => {
  const {
    bookingHistory, cancelBooking, changeBookingFlight, setActiveRoute, currency,
  } = useAppStore();

  const [mode, setMode] = useState<Mode>('retrieve');
  const [query, setQuery] = useState('');
  const [searchError, setSearchError] = useState('');
  const [active, setActive] = useState<BookingRecord | null>(null);

  const [confirmCancel, setConfirmCancel] = useState(false);
  const [done, setDone] = useState<DoneState | null>(null);
  const [chosenFlightId, setChosenFlightId] = useState<string>('');

  /* ── Retrieval ─────────────────────────────────────────────── */
  const handleRetrieve = (event: React.FormEvent) => {
    event.preventDefault();
    const cleaned = query.trim().toLowerCase().replace(/[\s-]/g, '');
    if (!cleaned) {
      setSearchError('Enter a booking reference, email address or surname.');
      return;
    }

    const found = bookingHistory.find((booking) => {
      const ref = booking.bookingRef.toLowerCase().replace(/[\s-]/g, '');
      if (ref === cleaned || ref.includes(cleaned)) return true;
      return booking.passengers.some(
        (passenger) =>
          passenger.email.toLowerCase() === query.trim().toLowerCase() ||
          passenger.lastName.toLowerCase() === query.trim().toLowerCase(),
      );
    });

    if (!found) {
      setSearchError('No booking matches that reference. Check your e-ticket email, or contact the desk.');
      return;
    }

    setSearchError('');
    setActive(found);
    setMode('overview');
  };

  /* ── Derived quotes ────────────────────────────────────────── */
  const refund = useMemo(() => (active ? calculateRefund(active) : null), [active]);

  const alternatives = useMemo(() => {
    if (!active) return [];
    const origin = active.flight?.origin;
    const destination = active.flight?.destination;
    return MOCK_FLIGHTS.filter(
      (flight) =>
        flight.id !== active.flight?.id &&
        (origin && destination ? flight.origin === origin && flight.destination === destination : true),
    ).slice(0, 4);
  }, [active]);

  const chosenFlight = alternatives.find((flight) => flight.id === chosenFlightId) ?? alternatives[0] ?? null;

  const changeQuote = useMemo(
    () => (active && chosenFlight ? calculateChangeQuote(active, chosenFlight.priceNgn) : null),
    [active, chosenFlight],
  );

  const hours = active ? hoursUntilDeparture(active.travelDate, active.flight?.departureTime) : 0;
  const canSelfServe = active ? active.status === 'confirmed' || active.status === 'active' : false;

  /* ── Actions ───────────────────────────────────────────────── */
  const handleCancel = () => {
    if (!active || !refund) return;
    cancelBooking(active.id, refund.refundAmountNgn, refund.cancellationFeeNgn);
    setDone({
      kind: 'cancelled',
      bookingRef: active.bookingRef,
      refundNgn: refund.refundAmountNgn,
    });
    setMode('done');
  };

  const handleChange = () => {
    if (!active || !chosenFlight || !changeQuote) return;
    changeBookingFlight(active.id, chosenFlight, changeQuote.amountDueNgn);
    setDone({
      kind: 'changed',
      bookingRef: active.bookingRef,
      amountDueNgn: changeQuote.amountDueNgn,
      newFlightLabel: `${chosenFlight.airline} ${chosenFlight.flightNumber}`,
    });
    setMode('done');
  };

  const reset = () => {
    setMode('retrieve');
    setActive(null);
    setQuery('');
    setDone(null);
    setConfirmCancel(false);
    setChosenFlightId('');
  };

  const shell = 'max-w-5xl mx-auto px-4 sm:px-6 lg:px-8';

  /* ══════════════════════════════════════════════════════════
     RETRIEVE
  ══════════════════════════════════════════════════════════ */
  if (mode === 'retrieve') {
    return (
      <div className="pt-24 pb-20">
        <div className={shell}>
          <div className="max-w-2xl">
            <span className="text-xs font-mono tracking-widest text-[#2B7574] dark:text-[#F2B632] uppercase">
              Manage booking
            </span>
            <h1 className="mt-2 font-display text-3xl sm:text-5xl font-bold uppercase tracking-tight text-[#0E2931] dark:text-[#EAEFEF]">
              Pull up a trip
            </h1>
            <p className="mt-3 text-sm leading-7 text-[#5A6B70] dark:text-[#8FA9AF]">
              Use the booking reference from your e-ticket, the email you booked with, or your surname.
              From here you can review the itinerary, cancel for a refund, or move to a different flight.
            </p>
          </div>

          <form onSubmit={handleRetrieve} className="mt-8 max-w-2xl" noValidate>
            <label htmlFor="booking-ref" className="mb-2 block text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-[#2B7574] dark:text-[#A5D1E1]">
              Booking reference, email or surname
            </label>
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9DA3] dark:text-[#5E7B84]" strokeWidth={1.8} />
                <input
                  id="booking-ref"
                  value={query}
                  onChange={(event) => { setQuery(event.target.value); if (searchError) setSearchError(''); }}
                  placeholder="AV-7821-LOS"
                  aria-invalid={Boolean(searchError)}
                  aria-describedby={searchError ? 'booking-ref-error' : 'booking-ref-hint'}
                  className="w-full rounded-xl border border-[#0E2931]/15 dark:border-[#EAEFEF]/15 bg-white dark:bg-[#0E2931]/70 py-3.5 pl-11 pr-4 text-[13.5px] font-mono text-[#0E2931] dark:text-[#EAEFEF] placeholder:text-[#8A9DA3] dark:placeholder:text-[#5E7B84] outline-none focus:border-[#2B7574] dark:focus:border-[#F2B632] transition-colors uppercase"
                />
              </div>
              <button type="submit" className="btn-gold inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.14em] cursor-pointer">
                Find booking
                <ArrowRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </div>
            {searchError ? (
              <p id="booking-ref-error" role="alert" className="mt-2.5 flex items-start gap-1.5 text-[11.5px] text-[#b4453f] dark:text-[#ff9b95]">
                <TriangleAlert className="mt-[1px] h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                {searchError}
              </p>
            ) : (
              <p id="booking-ref-hint" className="mt-2.5 text-[11px] leading-5 text-[#8A9DA3] dark:text-[#5E7B84]">
                Try <button type="button" onClick={() => setQuery('AV-7821-LOS')} className="font-mono underline decoration-dotted underline-offset-2 hover:text-[#2B7574] dark:hover:text-[#F2B632]">AV-7821-LOS</button> if you want to see a live example.
              </p>
            )}
          </form>

          {/* Policy transparency — show the rules before anyone commits */}
          <div className="mt-12 rounded-2xl border border-[#2B7574]/25 bg-white dark:bg-[#0E2931]/70 p-5 sm:p-7">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide text-[#0E2931] dark:text-[#EAEFEF]">
              <ShieldAlert className="h-4 w-4 text-[#2B7574] dark:text-[#F2B632]" strokeWidth={1.9} />
              How refunds are calculated
            </h2>
            <p className="mt-1.5 text-xs leading-6 text-[#5A6B70] dark:text-[#8FA9AF]">
              The fee depends only on how much notice you give. No hidden charges are added later.
            </p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {REFUND_POLICY_TIERS.map((tier) => (
                <li key={tier.id} className="flex items-start justify-between gap-3 rounded-xl border border-[#E2E2E0] dark:border-[#18363F] px-4 py-3">
                  <div>
                    <p className="text-[12px] font-semibold text-[#0E2931] dark:text-[#EAEFEF]">{tier.label}</p>
                    <p className="mt-0.5 text-[10.5px] leading-4 text-[#8A9DA3] dark:text-[#5E7B84]">{tier.description}</p>
                  </div>
                  <span className={`shrink-0 rounded-md border px-2 py-1 text-[10px] font-mono font-bold tabular-nums ${
                    tier.feePercent === 100
                      ? 'border-[#b4453f]/40 text-[#b4453f] dark:text-[#ff9b95]'
                      : 'border-[#2B7574]/35 text-[#2B7574] dark:text-[#F2B632]'
                  }`}>
                    {tier.feePercent === 100 ? 'No refund' : `${tier.feePercent}% fee`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════════
     DONE
  ══════════════════════════════════════════════════════════ */
  if (mode === 'done' && done) {
    const isCancel = done.kind === 'cancelled';
    return (
      <div className="pt-24 pb-20">
        <div className={shell}>
          <div className="mx-auto max-w-xl rounded-3xl border border-[#2B7574]/30 bg-white dark:bg-[#0E2931]/70 p-7 sm:p-10 text-center shadow-[0_30px_70px_-50px_rgba(14,41,49,0.8)]">
            <div className={`mx-auto grid h-14 w-14 place-items-center rounded-2xl ${isCancel ? 'bg-[#F2B632]/15 text-[#8a6516] dark:text-[#F2B632]' : 'bg-[#2B7574]/15 text-[#2B7574] dark:text-[#7fd4c1]'}`}>
              {isCancel ? <RotateCcw className="h-6 w-6" strokeWidth={1.9} /> : <CheckCircle2 className="h-6 w-6" strokeWidth={1.9} />}
            </div>

            <h1 className="mt-5 font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#0E2931] dark:text-[#EAEFEF]">
              {isCancel ? 'Booking cancelled' : 'Itinerary updated'}
            </h1>

            <p className="mt-3 text-[13px] leading-7 text-[#5A6B70] dark:text-[#8FA9AF]">
              {isCancel ? (
                <>
                  <span className="font-mono font-semibold text-[#0E2931] dark:text-[#EAEFEF]">{done.bookingRef}</span> has been cancelled.
                  {typeof done.refundNgn === 'number' && (
                    <> A refund of <span className="font-semibold text-[#2B7574] dark:text-[#F2B632]">{formatPrice(done.refundNgn, currency)}</span> has been queued to your original payment method, typically within 5–10 business days.</>
                  )}
                </>
              ) : (
                <>
                  <span className="font-mono font-semibold text-[#0E2931] dark:text-[#EAEFEF]">{done.bookingRef}</span> is now on{' '}
                  <span className="font-semibold text-[#0E2931] dark:text-[#EAEFEF]">{done.newFlightLabel}</span>.
                  {typeof done.amountDueNgn === 'number' && (
                    done.amountDueNgn >= 0
                      ? <> {formatPrice(done.amountDueNgn, currency)} was charged to your original payment method.</>
                      : <> {formatPrice(Math.abs(done.amountDueNgn), currency)} was issued to you as travel credit.</>
                  )}{' '}
                  A reissued boarding pass is available in your account.
                </>
              )}
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-2.5">
              <button
                onClick={() => { setActiveRoute('/account'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="btn-gold flex-1 rounded-xl px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] cursor-pointer"
              >
                Open my trips
              </button>
              <button
                onClick={reset}
                className="flex-1 rounded-xl border border-[#2B7574]/35 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#12484C] dark:text-[#F2B632] hover:bg-[#2B7574]/8 transition-colors cursor-pointer"
              >
                Manage another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!active) { reset(); return null; }

  /* ══════════════════════════════════════════════════════════
     OVERVIEW / CANCEL / CHANGE
  ══════════════════════════════════════════════════════════ */
  const originAirport = AIRPORTS.find((airport) => airport.code === active.flight?.origin);
  const destinationAirport = AIRPORTS.find((airport) => airport.code === active.flight?.destination);

  return (
    <div className="pt-24 pb-20">
      <div className={shell}>
        {/* Back + reference */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={mode === 'overview' ? reset : () => setMode('overview')}
            className="inline-flex items-center gap-1.5 text-[10.5px] font-mono font-bold uppercase tracking-[0.14em] text-[#2B7574] dark:text-[#F2B632] hover:opacity-70 transition-opacity cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2.2} />
            {mode === 'overview' ? 'All bookings' : 'Back to itinerary'}
          </button>
          <span className="rounded-lg border border-[#2B7574]/30 bg-white dark:bg-[#0E2931]/70 px-3 py-1.5 font-mono text-[11px] font-bold text-[#12484C] dark:text-[#F2B632]">
            PNR {active.bookingRef}
          </span>
        </div>

        {/* ── Itinerary card ── */}
        <div className="mt-5 overflow-hidden rounded-3xl border border-[#2B7574]/30 bg-[#0B1E24] text-white shadow-[0_30px_70px_-45px_rgba(0,0,0,0.9)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-5 py-4 sm:px-7">
            <div className="flex items-center gap-2">
              <span className={`rounded-md px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-[0.1em] ${
                active.status === 'cancelled'
                  ? 'bg-rose-500/15 text-rose-300'
                  : active.status === 'completed'
                    ? 'bg-white/10 text-[#A5D1E1]'
                    : 'bg-emerald-500/15 text-emerald-300'
              }`}>
                {active.status}
              </span>
              <span className="text-[10.5px] font-mono uppercase tracking-[0.14em] text-[#A5D1E1]/80">
                {active.type === 'hotel' ? 'Hotel stay' : active.type === 'bundle' ? 'Flight + hotel' : 'Flight booking'}
              </span>
            </div>
            {canSelfServe && (
              <span className="inline-flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-[0.12em] text-[#F2B632]">
                <Clock className="h-3 w-3" strokeWidth={2.2} />
                Departs in {describeCountdown(hours)}
              </span>
            )}
          </div>

          <div className="grid gap-6 px-5 py-6 sm:px-7 sm:py-8 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div>
              <p className="font-monument text-4xl font-extrabold leading-none">{active.flight?.origin ?? '—'}</p>
              <p className="mt-1.5 text-xs text-[#A5D1E1]">{originAirport?.city ?? 'Departure'}</p>
              <p className="mt-1 font-mono text-sm font-bold text-[#F2B632]">{active.flight?.departureTime ?? '—'}</p>
              <p className="text-[10.5px] text-[#A5D1E1]/70">{active.travelDate}</p>
            </div>

            <div className="flex flex-col items-center gap-1 md:px-6">
              <span className="text-[9.5px] font-mono uppercase tracking-[0.14em] text-[#A5D1E1]">
                {active.flight?.stops === 0 ? 'Non-stop' : `${active.flight?.stops ?? 0} stop`} · {active.flight?.duration ?? ''}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F2B632]" />
                <span className="h-px w-16 bg-gradient-to-r from-[#F2B632] to-emerald-400 sm:w-24" />
                <Plane className="h-4 w-4 -rotate-45 text-[#A5D1E1]" strokeWidth={1.8} />
                <span className="h-px w-16 bg-gradient-to-r from-emerald-400 to-[#2B7574] sm:w-24" />
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[10px] font-mono text-[#A5D1E1]/70">
                {active.flight?.airline ?? ''} {active.flight?.flightNumber ?? ''}
              </span>
            </div>

            <div className="md:text-right">
              <p className="font-monument text-4xl font-extrabold leading-none">{active.flight?.destination ?? '—'}</p>
              <p className="mt-1.5 text-xs text-[#A5D1E1]">{destinationAirport?.city ?? 'Arrival'}</p>
              <p className="mt-1 font-mono text-sm font-bold text-emerald-400">{active.flight?.arrivalTime ?? '—'}</p>
              <p className="text-[10.5px] text-[#A5D1E1]/70">{active.flight?.aircraft ?? ''}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-white/10 px-5 py-4 sm:grid-cols-4 sm:px-7">
            <Field label="Passenger" value={active.passengers[0] ? `${active.passengers[0].firstName} ${active.passengers[0].lastName}` : '—'} />
            <Field label="Seat" value={active.seat ?? active.passengers[0]?.seatNumber ?? 'Auto-assigned'} mono />
            <Field label="Paid" value={formatPrice(active.totalPaidNgn, currency)} mono />
            <Field
              label="Payment"
              value={active.paymentMethod === 'paylater' ? 'Pay later' : active.paymentMethod === 'card' ? 'Card' : 'Transfer'}
            />
          </div>

          {active.activity && active.activity.length > 0 && (
            <div className="border-t border-white/10 px-5 py-4 sm:px-7">
              <p className="text-[9.5px] font-mono uppercase tracking-[0.16em] text-[#A5D1E1]/70">Activity</p>
              <ul className="mt-2 space-y-1.5">
                {active.activity.slice(0, 4).map((entry) => (
                  <li key={entry.id} className="flex gap-2 text-[11px] leading-5 text-[#A5D1E1]">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-[#F2B632]" />
                    <span>
                      <span className="font-mono text-[9.5px] uppercase text-[#A5D1E1]/60">
                        {new Date(entry.at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>{' '}
                      {entry.summary}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* ── OVERVIEW actions ── */}
        {mode === 'overview' && (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="flex flex-col justify-between rounded-2xl border border-[#2B7574]/25 bg-white p-5 dark:bg-[#0E2931]/70 sm:p-6">
              <div>
                <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide text-[#0E2931] dark:text-[#EAEFEF]">
                  <Calendar className="h-4 w-4 text-[#2B7574] dark:text-[#F2B632]" strokeWidth={1.9} />
                  Move to another flight
                </h2>
                <p className="mt-1.5 text-xs leading-6 text-[#5A6B70] dark:text-[#8FA9AF]">
                  Same corridor, different departure. You pay the fare difference plus a flat{' '}
                  {formatPrice(12_500, currency)} handling fee. A cheaper option is returned as credit.
                </p>
              </div>
              <button
                disabled={!canSelfServe || alternatives.length === 0}
                onClick={() => { setChosenFlightId(alternatives[0]?.id ?? ''); setMode('change'); }}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-[#2B7574]/40 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#12484C] dark:text-[#F2B632] hover:bg-[#2B7574]/8 disabled:cursor-not-allowed disabled:opacity-40 transition-colors cursor-pointer"
              >
                Compare alternatives
                <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </div>

            <div className="flex flex-col justify-between rounded-2xl border border-[#2B7574]/25 bg-white p-5 dark:bg-[#0E2931]/70 sm:p-6">
              <div>
                <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase tracking-wide text-[#0E2931] dark:text-[#EAEFEF]">
                  <XCircle className="h-4 w-4 text-[#2B7574] dark:text-[#F2B632]" strokeWidth={1.9} />
                  Cancel this booking
                </h2>
                <p className="mt-1.5 text-xs leading-6 text-[#5A6B70] dark:text-[#8FA9AF]">
                  {refund && canSelfServe
                    ? <>On the current timing you would receive <span className="font-semibold text-[#0E2931] dark:text-[#EAEFEF]">{formatPrice(refund.refundAmountNgn, currency)}</span> back ({refund.feePercent}% fee).</>
                    : 'This booking is no longer cancellable online. Contact the desk and we will pursue the carrier on your behalf.'}
                </p>
              </div>
              <button
                disabled={!canSelfServe || !refund?.eligible}
                onClick={() => { setConfirmCancel(false); setMode('cancel'); }}
                className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl border border-[#b4453f]/35 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#b4453f] dark:text-[#ff9b95] hover:bg-[#b4453f]/8 disabled:cursor-not-allowed disabled:opacity-40 transition-colors cursor-pointer"
              >
                Review cancellation
                <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
              </button>
            </div>
          </div>
        )}

        {/* ── CANCEL flow ── */}
        {mode === 'cancel' && refund && (
          <div className="mt-6 rounded-2xl border border-[#2B7574]/25 bg-white p-5 dark:bg-[#0E2931]/70 sm:p-7">
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-[#0E2931] dark:text-[#EAEFEF]">
              Cancellation summary
            </h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-[#E2E2E0] px-4 py-3 dark:border-[#18363F]">
                <p className="text-[9.5px] font-mono uppercase tracking-[0.16em] text-[#8A9DA3] dark:text-[#5E7B84]">Amount paid</p>
                <p className="mt-0.5 font-mono text-base font-bold tabular-nums text-[#0E2931] dark:text-[#EAEFEF]">{formatPrice(refund.amountPaidNgn, currency)}</p>
              </div>
              <div className="rounded-xl border border-[#E2E2E0] px-4 py-3 dark:border-[#18363F]">
                <p className="text-[9.5px] font-mono uppercase tracking-[0.16em] text-[#8A9DA3] dark:text-[#5E7B84]">Cancellation fee ({refund.feePercent}%)</p>
                <p className="mt-0.5 font-mono text-base font-bold tabular-nums text-[#b4453f] dark:text-[#ff9b95]">− {formatPrice(refund.cancellationFeeNgn, currency)}</p>
              </div>
              <div className="rounded-xl border border-[#F2B632]/50 bg-[#F2B632]/8 px-4 py-3">
                <p className="text-[9.5px] font-mono uppercase tracking-[0.16em] text-[#8a6516] dark:text-[#F2B632]">Refund to you</p>
                <p className="mt-0.5 font-mono text-base font-bold tabular-nums text-[#8a6516] dark:text-[#F2B632]">{formatPrice(refund.refundAmountNgn, currency)}</p>
              </div>
            </div>

            <p className="mt-4 flex items-start gap-2 rounded-xl bg-[#F4F6F5] px-4 py-3 text-[11.5px] leading-6 text-[#5A6B70] dark:bg-[#061216]/60 dark:text-[#8FA9AF]">
              <Info className="mt-[3px] h-3.5 w-3.5 shrink-0 text-[#2B7574] dark:text-[#F2B632]" strokeWidth={1.9} />
              <span>
                <span className="font-semibold text-[#0E2931] dark:text-[#EAEFEF]">{refund.policyLabel}.</span>{' '}
                {refund.policyDescription}
                {refund.notices.map((notice) => ` ${notice}`).join('')}
              </span>
            </p>

            <label className="mt-5 flex items-start gap-2.5 text-[12px] leading-6 text-[#0E2931] dark:text-[#EAEFEF]">
              <input
                type="checkbox"
                checked={confirmCancel}
                onChange={(event) => setConfirmCancel(event.target.checked)}
                className="mt-1 h-3.5 w-3.5 shrink-0 accent-[#2B7574] dark:accent-[#F2B632] cursor-pointer"
              />
              <span>
                I understand this cancellation is final, that the fee above is non-refundable, and that
                any issued boarding pass will stop working.
              </span>
            </label>

            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <button
                disabled={!confirmCancel}
                onClick={handleCancel}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#b4453f] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-white hover:bg-[#9c3a35] disabled:cursor-not-allowed disabled:opacity-40 transition-colors cursor-pointer"
              >
                <XCircle className="h-4 w-4" strokeWidth={2.2} />
                Cancel and refund {formatPrice(refund.refundAmountNgn, currency)}
              </button>
              <button
                onClick={() => setMode('overview')}
                className="rounded-xl border border-[#2B7574]/35 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#12484C] dark:text-[#F2B632] hover:bg-[#2B7574]/8 transition-colors cursor-pointer"
              >
                Keep this booking
              </button>
            </div>
          </div>
        )}

        {/* ── CHANGE flow ── */}
        {mode === 'change' && changeQuote && (
          <div className="mt-6 rounded-2xl border border-[#2B7574]/25 bg-white p-5 dark:bg-[#0E2931]/70 sm:p-7">
            <h2 className="font-display text-xl font-bold uppercase tracking-wide text-[#0E2931] dark:text-[#EAEFEF]">
              Choose a replacement flight
            </h2>

            {alternatives.length === 0 ? (
              <p className="mt-4 text-sm text-[#5A6B70] dark:text-[#8FA9AF]">
                No alternative departures are published on this corridor right now. Call the desk and we will
                look at connecting options.
              </p>
            ) : (
              <>
                <ul className="mt-4 space-y-2.5">
                  {alternatives.map((flight) => {
                    const selected = chosenFlight?.id === flight.id;
                    const difference = flight.priceNgn - changeQuote.currentFareNgn;
                    return (
                      <li key={flight.id}>
                        <button
                          onClick={() => setChosenFlightId(flight.id)}
                          aria-pressed={selected}
                          className={`flex w-full items-center justify-between gap-4 rounded-xl border px-4 py-3.5 text-left transition-colors cursor-pointer ${
                            selected
                              ? 'border-[#F2B632] bg-[#F2B632]/8'
                              : 'border-[#E2E2E0] dark:border-[#18363F] hover:border-[#2B7574]/45'
                          }`}
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${selected ? 'bg-[#F2B632] text-[#0E2931]' : 'bg-[#12484C] text-[#F2B632]'}`}>
                              <Plane className="h-3.5 w-3.5 -rotate-45" strokeWidth={2} />
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-mono text-[12.5px] font-bold text-[#0E2931] dark:text-[#EAEFEF]">
                                {flight.departureTime} → {flight.arrivalTime} · {flight.flightNumber}
                              </p>
                              <p className="truncate text-[10.5px] text-[#8A9DA3] dark:text-[#5E7B84]">
                                {flight.airline} · {flight.duration} · {flight.stops === 0 ? 'non-stop' : `${flight.stops} stop`}
                              </p>
                            </div>
                          </div>
                          <div className="shrink-0 text-right">
                            <p className="font-mono text-[12.5px] font-bold tabular-nums text-[#0E2931] dark:text-[#EAEFEF]">
                              {formatPrice(flight.priceNgn, currency)}
                            </p>
                            <p className={`text-[10px] font-mono font-bold tabular-nums ${
                              difference > 0 ? 'text-[#b4453f] dark:text-[#ff9b95]' : difference < 0 ? 'text-[#2B7574] dark:text-[#7fd4c1]' : 'text-[#8A9DA3]'
                            }`}>
                              {difference === 0 ? 'same fare' : `${difference > 0 ? '+' : ''}${formatPrice(difference, currency)}`}
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {/* Cost breakdown */}
                <div className="mt-5 rounded-xl border border-[#2B7574]/25 bg-[#F4F6F5] px-4 py-4 dark:bg-[#061216]/60">
                  <div className="space-y-1.5 font-mono text-[11.5px]">
                    <div className="flex justify-between text-[#5A6B70] dark:text-[#8FA9AF]">
                      <span>Current fare</span>
                      <span className="tabular-nums">{formatPrice(changeQuote.currentFareNgn, currency)}</span>
                    </div>
                    <div className="flex justify-between text-[#5A6B70] dark:text-[#8FA9AF]">
                      <span>New fare</span>
                      <span className="tabular-nums">{formatPrice(changeQuote.newFareNgn, currency)}</span>
                    </div>
                    <div className="flex justify-between text-[#5A6B70] dark:text-[#8FA9AF]">
                      <span>Handling fee</span>
                      <span className="tabular-nums">{formatPrice(changeQuote.changeFeeNgn, currency)}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#2B7574]/25 pt-2 text-[13px] font-bold text-[#0E2931] dark:text-[#EAEFEF]">
                      <span>{changeQuote.amountDueNgn >= 0 ? 'Due now' : 'Credit to you'}</span>
                      <span className="tabular-nums">{formatPrice(Math.abs(changeQuote.amountDueNgn), currency)}</span>
                    </div>
                  </div>
                </div>

                {changeQuote.notices.length > 0 && (
                  <ul className="mt-3 space-y-1.5">
                    {changeQuote.notices.map((notice) => (
                      <li key={notice} className="flex items-start gap-2 text-[11px] leading-5 text-[#8A9DA3] dark:text-[#5E7B84]">
                        <Info className="mt-[2px] h-3 w-3 shrink-0" strokeWidth={1.9} />
                        {notice}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
                  <button
                    onClick={handleChange}
                    className="btn-gold inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-[11px] font-bold uppercase tracking-[0.12em] cursor-pointer"
                  >
                    <Ticket className="h-4 w-4" strokeWidth={2} />
                    Confirm change to {chosenFlight?.flightNumber}
                  </button>
                  <button
                    onClick={() => setMode('overview')}
                    className="rounded-xl border border-[#2B7574]/35 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.12em] text-[#12484C] dark:text-[#F2B632] hover:bg-[#2B7574]/8 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookingView;
