export type CurrencyCode = 'NGN' | 'USD';

export const CURRENCY_CONFIG = {
  exchangeRateNgnToUsd: 1 / 1550, // ₦1,550 = $1.00 USD
  exchangeRateUsdToNgn: 1550,
  defaultCurrency: 'NGN' as CurrencyCode,
};

/**
 * Convert an amount in base currency (NGN) to the target currency.
 */
export function convertCurrency(amountInNgn: number, targetCurrency: CurrencyCode): number {
  if (targetCurrency === 'USD') {
    return Math.round((amountInNgn * CURRENCY_CONFIG.exchangeRateNgnToUsd) * 100) / 100;
  }
  return Math.round(amountInNgn);
}

/**
 * Format a price with its proper currency symbol and tabular formatting.
 */
export function formatPrice(
  amountInNgn: number,
  currency: CurrencyCode = 'NGN',
  options?: { compact?: boolean; hideDecimals?: boolean }
): string {
  const converted = convertCurrency(amountInNgn, currency);

  if (currency === 'USD') {
    if (options?.compact && converted >= 1000) {
      return `$${(converted / 1000).toFixed(1)}k`;
    }
    return `$${converted.toLocaleString('en-US', {
      minimumFractionDigits: options?.hideDecimals ? 0 : 0,
      maximumFractionDigits: 0,
    })}`;
  }

  // NGN: Use explicit ₦ glyph with robust fallback formatting
  if (options?.compact && converted >= 1_000_000) {
    return `₦${(converted / 1_000_000).toFixed(1)}M`;
  }
  if (options?.compact && converted >= 1_000) {
    return `₦${(converted / 1_000).toFixed(0)}k`;
  }

  return `₦${converted.toLocaleString('en-NG', {
    maximumFractionDigits: 0,
  })}`;
}
