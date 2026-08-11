export type AppSection = 'today' | 'calendar' | 'gym' | 'goals' | 'log';

const items: Array<{ id: AppSection; label: string; icon: string }> = [
  { id: 'today', label: 'Today', icon: '☀' },
  { id: 'calendar', label: 'Calendar', icon: '▦' },
  { id: 'gym', label: 'Gym', icon: '♢' },
  { id: 'goals', label: 'Goals', icon: '◎' },
  { id: 'log', label: 'Log', icon: '✦' },
];

export function BottomNav({ active, onNavigate }: { active: AppSection; onNavigate: (section: AppSection) => void }) {
  return (
    <nav className="bottom-nav" aria-label="Primary">
      {items.map(item => (
        <button
          className={active === item.id ? 'nav-item active' : 'nav-item'}
          key={item.id}
          type="button"
          aria-current={active === item.id ? 'page' : undefined}
          onClick={() => onNavigate(item.id)}
        >
          <span className="nav-icon" aria-hidden="true">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
