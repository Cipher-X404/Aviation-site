import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateRefund,
  calculateChangeQuote,
  hoursUntilDeparture,
  describeCountdown,
  retrieveBookings,
  REFUND_POLICY_TIERS,
  CHANGE_FEE_NGN,
} from './bookingLifecycle.ts';
import { MOCK_FLIGHTS } from '../data/mockData.ts';
import type { BookingRecord } from '../store/useAppStore.ts';

const flight = MOCK_FLIGHTS[0]; // LOS → ABV, departs 07:15

function makeBooking(overrides: Partial<BookingRecord> = {}): BookingRecord {
  return {
    id: 'bk-test',
    bookingRef: 'AV-1000-ABV',
    type: 'flight',
    flight,
    passengers: [
      {
        firstName: 'Folashade',
        lastName: 'Adeleke',
        email: 'folashade.adeleke@lagoonhealth.ng',
        phone: '+234 803 456 7890',
      },
    ],
    totalPaidNgn: 200_000,
    paymentMethod: 'card',
    bookingDate: '2026-11-01',
    travelDate: '2026-12-01',
    status: 'confirmed',
    qrCodeSeed: 'SEED',
    ...overrides,
  };
}

/** A "now" that is exactly `hours` before the 07:15 departure on 2026-12-01. */
function nowHoursBefore(hours: number): Date {
  return new Date(new Date('2026-12-01T07:15:00').getTime() - hours * 3_600_000);
}

test('hoursUntilDeparture uses the flight departure time when present', () => {
  const hours = hoursUntilDeparture('2026-12-01', '07:15', nowHoursBefore(48));
  assert.ok(Math.abs(hours - 48) < 0.001, `expected 48 hours, received ${hours}`);
});

test('hoursUntilDeparture falls back to 14:00 for hotel stays', () => {
  const noon = new Date('2026-12-01T12:00:00');
  // Check-in is 14:00, so two hours remain.
  assert.equal(hoursUntilDeparture('2026-12-01', undefined, noon), 2);
});

test('refund tiers step down as notice shortens', () => {
  const paid = 200_000;

  const generous = calculateRefund(makeBooking(), nowHoursBefore(100));
  assert.equal(generous.policyTierId, 'flex-72h');
  assert.equal(generous.feePercent, 10);
  assert.equal(generous.refundAmountNgn, 180_000);

  const mid = calculateRefund(makeBooking(), nowHoursBefore(48));
  assert.equal(mid.policyTierId, 'flex-24h');
  assert.equal(mid.refundAmountNgn, 160_000);

  const tight = calculateRefund(makeBooking(), nowHoursBefore(10));
  assert.equal(tight.policyTierId, 'flex-3h');
  assert.equal(tight.refundAmountNgn, 100_000);

  const none = calculateRefund(makeBooking(), nowHoursBefore(1));
  assert.equal(none.policyTierId, 'no-show');
  assert.equal(none.refundAmountNgn, 0);
  assert.equal(none.eligible, false);
  assert.equal(none.amountPaidNgn, paid);
});

test('boundary hours land on the more generous tier', () => {
  assert.equal(calculateRefund(makeBooking(), nowHoursBefore(72)).policyTierId, 'flex-72h');
  assert.equal(calculateRefund(makeBooking(), nowHoursBefore(24)).policyTierId, 'flex-24h');
  assert.equal(calculateRefund(makeBooking(), nowHoursBefore(3)).policyTierId, 'flex-3h');
});

test('cancelling an already cancelled booking is not offered again', () => {
  const quote = calculateRefund(makeBooking({ status: 'cancelled' }), nowHoursBefore(100));
  assert.equal(quote.eligible, false);
  assert.match(quote.notices.join(' '), /already cancelled/i);
});

test('financed bookings route the refund to the facility', () => {
  const quote = calculateRefund(
    makeBooking({
      paymentMethod: 'paylater',
      loanDetails: {
        tenureMonths: 6,
        monthlyPaymentNgn: 30_000,
        downPaymentPaidNgn: 40_000,
        remainingBalanceNgn: 100_000,
        totalPaidSoFarNgn: 80_000,
        installmentsRemaining: 4,
      },
    }),
    nowHoursBefore(100),
  );
  assert.equal(quote.settlesLoan, true);
  assert.match(quote.notices.join(' '), /facility balance/i);
});

test('changing to a dearer flight charges the difference plus the flat fee', () => {
  const booking = makeBooking();
  const quote = calculateChangeQuote(booking, flight.priceNgn + 50_000, nowHoursBefore(100));
  assert.equal(quote.fareDifferenceNgn, 50_000);
  assert.equal(quote.changeFeeNgn, CHANGE_FEE_NGN);
  assert.equal(quote.amountDueNgn, 50_000 + CHANGE_FEE_NGN);
  assert.equal(quote.eligible, true);
});

test('changing to a cheaper flight returns a negative balance owed', () => {
  const booking = makeBooking();
  const quote = calculateChangeQuote(booking, flight.priceNgn - 30_000, nowHoursBefore(100));
  assert.equal(quote.amountDueNgn, -30_000 + CHANGE_FEE_NGN);
  assert.match(quote.notices.join(' '), /travel credit/i);
});

test('cancelled bookings cannot be changed', () => {
  const quote = calculateChangeQuote(makeBooking({ status: 'cancelled' }), 999_999, nowHoursBefore(100));
  assert.equal(quote.eligible, false);
  assert.equal(quote.changeFeeNgn, 0);
});

test('every policy tier is reachable and ordered by notice period', () => {
  const sorted = [...REFUND_POLICY_TIERS].sort(
    (a, b) => b.minHoursBeforeDeparture - a.minHoursBeforeDeparture,
  );
  assert.equal(sorted[0].id, 'flex-72h');
  assert.equal(sorted[sorted.length - 1].id, 'no-show');
});

test('describeCountdown formats days, hours and minutes', () => {
  assert.equal(describeCountdown(0), 'Departed');
  assert.equal(describeCountdown(-4), 'Departed');
  assert.equal(describeCountdown(0.5), '30 minutes');
  assert.equal(describeCountdown(5), '5h 0m');
  assert.equal(describeCountdown(48), '2 days');
  assert.equal(describeCountdown(52), '2 days, 4h');
});

test('retrieveBookings matches reference, email and surname', () => {
  const history = [
    makeBooking({ id: 'a', bookingRef: 'AV-7821-LOS' }),
    makeBooking({
      id: 'b',
      bookingRef: 'HT-4410-EKO',
      passengers: [
        { firstName: 'Chinedu', lastName: 'Eze', email: 'chinedu@example.ng', phone: '+2348000000000' },
      ],
    }),
  ];

  assert.equal(retrieveBookings(history, 'AV-7821-LOS')[0].id, 'a');
  // Case and hyphen insensitive
  assert.equal(retrieveBookings(history, 'av7821los')[0].id, 'a');
  assert.equal(retrieveBookings(history, 'chinedu@example.ng')[0].id, 'b');
  assert.equal(retrieveBookings(history, 'Eze')[0].id, 'b');
  assert.equal(retrieveBookings(history, '   ').length, 0);
  assert.equal(retrieveBookings(history, 'nobody').length, 0);
});
