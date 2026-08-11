import { dayPhase, distanceMeters, nearestGym, weatherKind } from './context';
import type { GymPlace } from './types';

const gym: GymPlace = { id: 'gym', name: 'Garden gym', latitude: 12.9716, longitude: 77.5946, radiusMeters: 150 };

test('selects a gym only inside its saved arrival radius', () => {
  expect(Math.round(distanceMeters({ latitude: 12.9716, longitude: 77.5946 }, { latitude: 12.9725, longitude: 77.5946 }))).toBe(100);
  expect(nearestGym([gym], { latitude: 12.9725, longitude: 77.5946 })?.name).toBe('Garden gym');
  expect(nearestGym([gym], { latitude: 12.9735, longitude: 77.5946 })).toBeNull();
});

test('maps local hour and weather codes to the four calm ambience states', () => {
  expect([dayPhase(5), dayPhase(11), dayPhase(19), dayPhase(23)]).toEqual(['dawn', 'day', 'dusk', 'night']);
  expect([weatherKind(0), weatherKind(2), weatherKind(61), weatherKind(71)]).toEqual(['clear', 'cloud', 'rain', 'snow']);
});
