import { useEffect, useState } from 'react';

const meditations = {
  Sleep: 'Let your shoulders soften. Breathe in slowly, then make the out-breath a little longer. Nothing else needs solving tonight.',
  Habits: 'Notice one tiny action you can repeat. Breathe in with intention, and out with patience. Small repetitions are enough.',
  Confidence: 'Sit tall without forcing it. Breathe in steadiness and let doubt pass without arguing with it. You can take the next step.',
  Productivity: 'Choose the single thing that matters now. Breathe in, let the noise settle, and return your attention to that one clear step.',
} as const;
type Path = keyof typeof meditations;

export function WellnessTools() {
  const [mode, setMode] = useState<'focus' | 'meditate'>('focus');
  const [focus, setFocus] = useState<25 | 50>(25);
  const [phase, setPhase] = useState<'focus' | 'rest'>('focus');
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [path, setPath] = useState<Path>('Sleep');
  useEffect(() => () => { if ('speechSynthesis' in window) speechSynthesis.cancel(); }, []);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds(value => {
      if (value > 1) return value - 1;
      if (mode === 'meditate') { setRunning(false); return 0; }
      const next = phase === 'focus' ? 'rest' : 'focus';
      setPhase(next);
      return (next === 'focus' ? focus : focus === 25 ? 5 : 10) * 60;
    }), 1000);
    return () => window.clearInterval(timer);
  }, [focus, mode, phase, running]);

  const chooseFocus = (minutes: 25 | 50) => { setFocus(minutes); setPhase('focus'); setSeconds(minutes * 60); setRunning(false); };
  const beginMeditation = () => {
    setSeconds(3 * 60);
    setRunning(true);
    if ('speechSynthesis' in window && 'SpeechSynthesisUtterance' in window) {
      speechSynthesis.cancel();
      speechSynthesis.speak(new SpeechSynthesisUtterance(meditations[path]));
    }
  };

  return <div className="wellness-tools">
    <nav aria-label="Focus and calm"><button aria-pressed={mode === 'focus'} onClick={() => { setMode('focus'); chooseFocus(focus); }}>Pomodoro</button><button aria-pressed={mode === 'meditate'} onClick={() => { setMode('meditate'); setRunning(false); setSeconds(3 * 60); }}>Meditate</button></nav>
    {mode === 'focus' ? <section><p className="eyebrow">{phase === 'focus' ? 'Deep focus' : 'Garden break'}</p><div className="wellness-clock">{clock(seconds)}</div><div className="wellness-choices"><button aria-pressed={focus === 25} onClick={() => chooseFocus(25)}>25 / 5</button><button aria-pressed={focus === 50} onClick={() => chooseFocus(50)}>50 / 10</button></div><button className="primary-button" onClick={() => setRunning(value => !value)}>{running ? 'Pause timer' : seconds < focus * 60 ? 'Resume timer' : 'Start focus'}</button></section> : <section><p className="eyebrow">Three guided minutes</p><div className="wellness-clock">{clock(seconds)}</div><div className="meditation-paths">{(Object.keys(meditations) as Path[]).map(item => <button key={item} aria-pressed={path === item} onClick={() => setPath(item)}>{item}</button>)}</div><p className="meditation-preview">{meditations[path]}</p><button className="primary-button" onClick={beginMeditation}>{running ? 'Restart meditation' : 'Begin meditation'}</button></section>}
  </div>;
}

function clock(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
}
