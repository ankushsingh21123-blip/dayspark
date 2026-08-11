import type { GymPlace } from './types';

export type Coordinates = { latitude: number; longitude: number };
export type DayPhase = 'dawn' | 'day' | 'dusk' | 'night';
export type WeatherKind = 'clear' | 'cloud' | 'rain' | 'snow';

export function distanceMeters(a: Coordinates, b: Coordinates) {
  const radians = Math.PI / 180;
  const lat = (b.latitude - a.latitude) * radians;
  const lon = (b.longitude - a.longitude) * radians;
  const value = Math.sin(lat / 2) ** 2 + Math.cos(a.latitude * radians) * Math.cos(b.latitude * radians) * Math.sin(lon / 2) ** 2;
  return 12_742_000 * Math.asin(Math.sqrt(value));
}

export function nearestGym(places: GymPlace[], current: Coordinates) {
  const nearby = places.map(place => ({ place, distance: distanceMeters(place, current) })).filter(item => item.distance <= item.place.radiusMeters).sort((a, b) => a.distance - b.distance)[0];
  return nearby?.place ?? null;
}

export function dayPhase(hour: number): DayPhase {
  return hour < 7 ? 'dawn' : hour < 18 ? 'day' : hour < 21 ? 'dusk' : 'night';
}

export function weatherKind(code: number): WeatherKind {
  if (code >= 71 && code <= 86) return 'snow';
  if ((code >= 51 && code <= 69) || (code >= 80 && code <= 99)) return 'rain';
  return code >= 1 && code <= 3 ? 'cloud' : 'clear';
}
