// ============================================================================
// STATIC EXCHANGE RATES — hardcoded, update-able constants
// ============================================================================
// NO WRAPPER CONSTRAINT NOTE: This is intentionally a static config object,
// not a live currency-conversion API call, to keep the app fully offline /
// dependency-free for the hackathon (and because a live FX rate has nothing
// to do with an LLM anyway — using an API here would just be an unnecessary
// network dependency, not a "no wrapper" violation, but we're avoiding it
// per the spec's request for a static/offline-friendly approach).
//
// Units: local currency per 1 USD. Update these numbers before a demo if
// they've drifted meaningfully — swap this file for a real FX API
// (e.g. exchangerate.host, a bank API) post-hackathon if live rates matter.
// Last manually checked: 2026-09-18 (approximate, round-number placeholders —
// replace with actual checked rates before relying on this for the demo).
// ============================================================================

export const usdExchangeRates: Record<string, number> = {
  GBP: 0.79, // British pound
  JPY: 150, // Japanese yen
  EUR: 0.92, // Euro
  USD: 1,
};

export function convertToUsd(amountLocal: number, currencyCode: string): number {
  const rate = usdExchangeRates[currencyCode];
  if (!rate) {
    throw new Error(`No exchange rate configured for currency: ${currencyCode}`);
  }
  return amountLocal / rate;
}
