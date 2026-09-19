export function usd(n: number): string {
  return `$${Math.round(n).toLocaleString()}`;
}

export function range(low: number, high: number, fmt: (n: number) => string = usd): string {
  return low === high ? fmt(low) : `${fmt(low)}–${fmt(high)}`;
}
