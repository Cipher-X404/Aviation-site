import test from 'node:test';
import assert from 'node:assert/strict';
import { convertCurrency, formatPrice } from './currency.ts';

test('convertCurrency correctly converts NGN to USD at 1550 rate', () => {
  const amountNgn = 155_000;
  const usd = convertCurrency(amountNgn, 'USD');
  assert.equal(usd, 100);

  const sameNgn = convertCurrency(amountNgn, 'NGN');
  assert.equal(sameNgn, 155_000);
});

test('formatPrice renders correct symbol and tabular formatting', () => {
  const priceNgn = 450_000;

  const formattedNgn = formatPrice(priceNgn, 'NGN');
  assert.match(formattedNgn, /^₦450,000/);

  const formattedUsd = formatPrice(priceNgn, 'USD');
  assert.match(formattedUsd, /^\$290/);
});

test('formatPrice compact mode formats millions and thousands properly', () => {
  assert.equal(formatPrice(1_500_000, 'NGN', { compact: true }), '₦1.5M');
  assert.equal(formatPrice(250_000, 'NGN', { compact: true }), '₦250k');
});
