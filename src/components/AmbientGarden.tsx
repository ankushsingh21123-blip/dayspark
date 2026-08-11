import type { AppSection } from './BottomNav';

const sectionMarks: Record<AppSection, string> = { today: '✦', calendar: '◌', gym: '◇', goals: '◎', log: '✧' };

export function AmbientGarden({ section }: { section: AppSection }) {
  return <div className="ambient-garden" aria-hidden="true">
    <div className="ambient-sky"><i className="ambient-orb" /><i className="ambient-halo" /></div>
    <div className="ambient-weather"><i className="weather-cloud" /><i className="weather-rain" /><i className="weather-snow" /></div>
    <div className="ambient-canopy canopy-far"><i /><i /><i /></div>
    <div className="ambient-canopy canopy-near"><i /><i /><i /></div>
    <div className="ambient-fireflies"><i /><i /><i /><i /><i /></div>
    <div className="section-totem"><i /><span>{sectionMarks[section]}</span><b /></div>
  </div>;
}
