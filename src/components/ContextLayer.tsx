import { useEffect, useState } from 'react';
import { dayPhase, nearestGym, weatherKind, type DayPhase, type WeatherKind } from '../domain/context';
import type { GymPlace, User } from '../domain/types';

export function useContextLayer(user?: User) {
  const [nearbyGym, setNearbyGym] = useState<GymPlace | null>(null);
  const [weather, setWeather] = useState<WeatherKind | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const phase = dayPhase(new Date().getHours());

  useEffect(() => {
    document.documentElement.dataset.dayphase = phase;
    const places = user?.gymPlaces ?? [];
    if (!user || ((!user.contextualAmbience && places.length === 0) || !navigator.geolocation)) return;
    let active = true;
    navigator.geolocation.getCurrentPosition(position => {
      if (!active) return;
      const current = { latitude: position.coords.latitude, longitude: position.coords.longitude };
      setNearbyGym(nearestGym(places, current));
      if (!user.contextualAmbience) return;
      const latitude = current.latitude.toFixed(2);
      const longitude = current.longitude.toFixed(2);
      void fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=weather_code&timezone=auto`)
        .then(response => response.ok ? response.json() : Promise.reject())
        .then(data => { if (active) setWeather(weatherKind(Number(data.current?.weather_code ?? 0))); })
        .catch(() => undefined);
    }, () => undefined, { enableHighAccuracy: false, timeout: 8_000, maximumAge: 15 * 60_000 });
    return () => { active = false; };
  }, [phase, user?.contextualAmbience, user?.gymPlaces]);

  useEffect(() => {
    if (weather) document.documentElement.dataset.weather = weather;
    else delete document.documentElement.dataset.weather;
  }, [weather]);

  return { nearbyGym: dismissed ? null : nearbyGym, label: ambienceLabel(weather, phase), dismissNearby: () => setDismissed(true) };
}

export function ContextLayer({ label, nearbyGym, onDismiss, onStartGym }: { label: string; nearbyGym: GymPlace | null; onDismiss(): void; onStartGym(): void }) {
  return <>
    <p className="context-whisper" aria-live="polite"><span aria-hidden="true">{label.startsWith('Rain') ? '☂' : '✦'}</span>{label}</p>
    {nearbyGym && <aside className="gym-arrival" aria-label={`You are near ${nearbyGym.name}`}><span aria-hidden="true">⌖</span><div><small>Workout place</small><strong>At {nearbyGym.name}</strong></div><button type="button" aria-label={`Start workout at ${nearbyGym.name}`} onClick={onStartGym}>Start workout</button><button type="button" aria-label="Dismiss nearby gym" onClick={onDismiss}>×</button></aside>}
  </>;
}

function ambienceLabel(weather: WeatherKind | null, phase: DayPhase) {
  if (weather === 'rain') return 'Rain nearby · DaySpark feels softer';
  if (weather === 'snow') return 'Snow nearby · a quiet garden';
  if (weather === 'cloud') return 'Clouds nearby · gentle light';
  return phase === 'dawn' ? 'Dawn garden · waking slowly' : phase === 'dusk' ? 'Dusk garden · winding down' : phase === 'night' ? 'Night garden · lanterns on' : 'Day garden · light and open';
}
