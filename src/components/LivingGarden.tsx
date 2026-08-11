import { useEffect, useRef, useState } from 'react';
import { gardenStage } from '../domain/garden';
import type { Celebration, GardenSeason } from '../domain/types';

export function LivingGarden({ done, total, streak, season, celebration }: { done: number; total: number; streak: number; season: GardenSeason; celebration: Celebration }) {
  const stage = gardenStage(done, total);
  const previous = useRef(done);
  const [celebrating, setCelebrating] = useState(false);
  useEffect(() => {
    if (done <= previous.current) { previous.current = done; return; }
    previous.current = done;
    const reduced = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) {
      setCelebrating(true);
      if (celebration === 'full') navigator.vibrate?.(12);
      const timer = window.setTimeout(() => setCelebrating(false), 700);
      return () => window.clearTimeout(timer);
    }
  }, [celebration, done]);
  const rank = ['soil', 'sprout', 'leaves', 'bloom', 'lantern'].indexOf(stage);
  return <div className={`living-garden stage-${stage} ${celebrating ? 'celebrating' : ''}`} data-season={season}>
    <svg role="img" aria-label={`Living garden: ${stage}, ${done} of ${total} tasks complete`} viewBox="0 0 180 150">
      <ellipse className="garden-glow" cx="90" cy="127" rx="58" ry="14" />
      <path className="garden-soil" d="M34 125c20-17 92-17 112 0-22 14-91 17-112 0Z" />
      {rank >= 1 && <path className="garden-stem" d="M90 125C88 99 93 76 90 45" />}
      {rank >= 2 && <g className="garden-leaves" aria-hidden="true"><path d="M90 101C68 101 63 85 65 78c14-1 25 5 25 23Z" /><path d="M91 84c22 0 27-16 25-23-14-1-25 6-25 23Z" /><path d="M90 68c-15-1-19-12-17-19 10 0 17 5 17 19Z" /></g>}
      {rank >= 3 && <g className="garden-flower" aria-hidden="true"><ellipse cx="90" cy="37" rx="11" ry="20" /><ellipse cx="90" cy="37" rx="11" ry="20" transform="rotate(72 90 37)" /><ellipse cx="90" cy="37" rx="11" ry="20" transform="rotate(144 90 37)" /><ellipse cx="90" cy="37" rx="11" ry="20" transform="rotate(216 90 37)" /><ellipse cx="90" cy="37" rx="11" ry="20" transform="rotate(288 90 37)" /><circle cx="90" cy="37" r="8" /></g>}
      {rank >= 4 && <g className="garden-lantern" aria-hidden="true"><circle cx="90" cy="37" r="24" /><circle cx="90" cy="37" r="11" /></g>}
      {celebrating && <g className="garden-petals" aria-hidden="true"><circle cx="48" cy="52" r="4" /><circle cx="132" cy="62" r="4" /><circle cx="62" cy="24" r="3" /><circle cx="123" cy="19" r="3" /></g>}
    </svg>
    <span>{total ? `${done}/${total}` : 'open'} · {streak} day glow</span>
  </div>;
}
