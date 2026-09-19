export function usd(n: number): string {
  return `$${Math.round(n).toLocaleString()}`;
}

export function range(low: number, high: number, fmt: (n: number) => string = usd): string {
  return low === high ? fmt(low) : `${fmt(low)}–${fmt(high)}`;
}

export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

export function formatKm(km: number): string {
  return km < 1 ? `${Math.round(km * 10) * 100} m` : `${km.toFixed(1)} km`;
}
