/**
 * Booking lifecycle engine — cancellation, refunds and flight changes.
 *
 * This is the piece the platform was missing entirely: once a booking is
 * confirmed, there was previously no way to retrieve it by reference, price a
 * change, or cancel it. Everything here is pure, deterministic logic so it can
 * be unit tested and reused by the account dashboard and the manage-booking
 * page without duplicating policy rules.
 */

import type { BookingRecord } from '../store/useAppStore';

/** Window, in hours before departure, that selects a refund tier. */
export interface RefundPolicyTier {
  id: string;
  /** Minimum hours before departure for this tier to apply. */
  minHoursBeforeDeparture: number;
  label: string;
  /** Percentage of the fare retained by the agency/carrier as a cancellation fee. */
  feePercent: number;
  description: string;
}

/**
 * Ordered from most restrictive (shortest notice) to most generous, so the
 * first tier whose threshold the booking satisfies wins.
 */
export const REFUND_POLICY_TIERS: RefundPolicyTier[] = [
  {
    id: 'no-show',
    minHoursBeforeDeparture: -Infinity,
    label: 'Within 3 hours or after departure',
    feePercent: 100,
    description: 'The fare is non-refundable once the cancellation window has closed. Taxes may still be claimed directly from the carrier.',
  },
  {
    id: 'flex-3h',
    minHoursBeforeDeparture: 3,
    label: '3 – 24 hours before departure',
    feePercent: 50,
    description: 'Half the fare is retained to cover the carrier penalty. The remaining balance is refunded to the original payment method.',
  },
  {
    id: 'flex-24h',
    minHoursBeforeDeparture: 24,
    label: '24 – 72 hours before departure',
    feePercent: 20,
    description: 'A reduced carrier penalty applies. Most of the ticket value is returned.',
  },
  {
    id: 'flex-72h',
    minHoursBeforeDeparture: 72,
    label: 'More than 72 hours before departure',
    feePercent: 10,
    description: 'The most flexible window. Only the standard booking service fee is retained.',
  },
];

/** Flat handling charge applied to voluntary changes, in naira. */
export const CHANGE_FEE_NGN = 12_500;

export interface RefundQuote {
  eligible: boolean;
  policyTierId: string;
  policyLabel: string;
  policyDescription: string;
  hoursBeforeDeparture: number;
  amountPaidNgn: number;
  feePercent: number;
  cancellationFeeNgn: number;
  refundAmountNgn: number;
  /** True when a loan is attached — the lender, not the traveller, receives the refund. */
  settlesLoan: boolean;
  notices: string[];
}

export interface ChangeQuote {
  eligible: boolean;
  hoursBeforeDeparture: number;
  currentFareNgn: number;
  newFareNgn: number;
  fareDifferenceNgn: number;
  changeFeeNgn: number;
  /** Total the traveller pays now. Negative means a credit is owed. */
  amountDueNgn: number;
  notices: string[];
}

/** Reasons a booking cannot be self-served and must go to the desk. */
const TERMINAL_STATUSES: BookingRecord['status'][] = ['cancelled', 'completed'];

/**
 * Hours between "now" and the travel date's departure. Flight bookings carry a
 * departure time; hotel bookings check in at 14:00 local time by convention.
 */
export function hoursUntilDeparture(
  travelDate: string,
  departureTime?: string,
  now: Date = new Date(),
): number {
  const time = departureTime && /^\d{2}:\d{2}$/.test(departureTime) ? departureTime : '14:00';
  const target = new Date(`${travelDate}T${time}:00`);
  if (Number.isNaN(target.getTime())) return 0;
  return (target.getTime() - now.getTime()) / 36e5;
}

function resolveTier(hours: number): RefundPolicyTier {
  if (hours < 3) return REFUND_POLICY_TIERS[0];
  if (hours < 24) return REFUND_POLICY_TIERS[1];
  if (hours < 72) return REFUND_POLICY_TIERS[2];
  return REFUND_POLICY_TIERS[3];
}

/**
 * Prices a voluntary cancellation.
 *
 * `now` is injectable so the behaviour is testable and so the UI can preview a
 * refund for a hypothetical moment.
 */
export function calculateRefund(
  booking: BookingRecord,
  now: Date = new Date(),
): RefundQuote {
  const departureTime = booking.flight?.departureTime;
  const hours = hoursUntilDeparture(booking.travelDate, departureTime, now);
  const tier = resolveTier(hours);

  const notices: string[] = [];
  const alreadyTerminal = TERMINAL_STATUSES.includes(booking.status);

  if (alreadyTerminal) {
    notices.push(
      booking.status === 'cancelled'
        ? 'This booking is already cancelled.'
        : 'This trip has already been flown and cannot be cancelled.',
    );
  }

  const settlesLoan = Boolean(booking.loanDetails) && booking.paymentMethod === 'paylater';
  if (settlesLoan) {
    notices.push(
      'Because this trip is financed, the refund is applied to your outstanding facility balance first. Any surplus is returned to your bank account.',
    );
  }
  if (tier.feePercent >= 100) {
    notices.push('Within the no-refund window only airport taxes can be reclaimed, and only directly from the operating carrier.');
  }
  if (booking.type === 'hotel') {
    notices.push('Hotel cancellation terms are confirmed with the property. Some rates are fully prepaid and non-refundable.');
  }

  const feePercent = tier.feePercent;
  const cancellationFeeNgn = Math.round((booking.totalPaidNgn * feePercent) / 100);
  const refundAmountNgn = Math.max(0, booking.totalPaidNgn - cancellationFeeNgn);

  return {
    eligible: !alreadyTerminal && refundAmountNgn > 0,
    policyTierId: tier.id,
    policyLabel: tier.label,
    policyDescription: tier.description,
    hoursBeforeDeparture: Math.round(hours * 10) / 10,
    amountPaidNgn: booking.totalPaidNgn,
    feePercent,
    cancellationFeeNgn,
    refundAmountNgn,
    settlesLoan,
    notices,
  };
}

/**
 * Prices a voluntary flight change onto `newFareNgn`.
 *
 * A cheaper alternative produces a negative `amountDueNgn`: the traveller is
 * owed a credit rather than charged, which is deliberately surfaced instead of
 * being clamped to zero.
 */
export function calculateChangeQuote(
  booking: BookingRecord,
  newFareNgn: number,
  now: Date = new Date(),
): ChangeQuote {
  const departureTime = booking.flight?.departureTime;
  const hours = hoursUntilDeparture(booking.travelDate, departureTime, now);
  const notices: string[] = [];

  const currentFareNgn = booking.flight?.priceNgn ?? booking.totalPaidNgn;
  const fareDifferenceNgn = newFareNgn - currentFareNgn;

  const terminal = TERMINAL_STATUSES.includes(booking.status);
  if (terminal) {
    notices.push(
      booking.status === 'cancelled'
        ? 'Cancelled bookings cannot be changed. Start a new booking instead.'
        : 'Flown trips cannot be changed.',
    );
  }

  if (hours < 3) {
    notices.push('Changes requested within 3 hours of departure are subject to carrier discretion and may be refused at the airport.');
  }

  const changeFeeNgn = terminal ? 0 : CHANGE_FEE_NGN;
  const amountDueNgn = fareDifferenceNgn + changeFeeNgn;

  if (amountDueNgn < 0) {
    notices.push('The alternative is cheaper, so the difference is issued as a travel credit rather than a cash refund.');
  }
  if (booking.paymentMethod === 'paylater' && booking.loanDetails) {
    notices.push('An increase on a financed booking is added to your facility balance. A decrease reduces it.');
  }

  return {
    eligible: !terminal,
    hoursBeforeDeparture: Math.round(hours * 10) / 10,
    currentFareNgn,
    newFareNgn,
    fareDifferenceNgn,
    changeFeeNgn,
    amountDueNgn,
    notices,
  };
}

/**
 * Finds a booking from a free-text reference.
 *
 * Accepts a booking reference (`AV-7821-LOS`, case and hyphens irrelevant) or a
 * passenger email / surname, so a traveller who has lost their reference can
 * still retrieve the trip.
 */
export function retrieveBookings(
  history: BookingRecord[],
  rawQuery: string,
): BookingRecord[] {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const normalised = query.replace(/[\s-]/g, '');

  return history.filter((booking) => {
    const ref = booking.bookingRef.toLowerCase().replace(/[\s-]/g, '');
    if (ref === normalised || ref.includes(normalised)) return true;
    if (booking.id.toLowerCase() === query) return true;

    return booking.passengers.some(
      (passenger) =>
        passenger.email.toLowerCase() === query ||
        passenger.lastName.toLowerCase() === query ||
        `${passenger.firstName} ${passenger.lastName}`.toLowerCase() === query,
    );
  });
}

/** Human-friendly "2 days, 4 hours" style countdown for the departure card. */
export function describeCountdown(hours: number): string {
  if (hours <= 0) return 'Departed';
  if (hours < 1) return `${Math.max(1, Math.round(hours * 60))} minutes`;
  if (hours < 24) return `${Math.floor(hours)}h ${Math.round((hours % 1) * 60)}m`;
  const days = Math.floor(hours / 24);
  const remainder = Math.round(hours % 24);
  return remainder === 0 ? `${days} days` : `${days} days, ${remainder}h`;
}
