import type { ReactNode } from 'react';
import { BottomNav, type AppSection } from './BottomNav';

type Props = {
  active: AppSection;
  onNavigate: (section: AppSection) => void;
  children: ReactNode;
  context?: ReactNode;
  onOpenSettings?: () => void;
};

export function AppShell({ active, onNavigate, children, context, onOpenSettings }: Props) {
  return (
    <div className="app-shell">
      <aside className="brand-rail" aria-label="DaySpark">
        <div className="brand-mark" aria-hidden="true">✦</div>
        <span className="brand-name">DaySpark</span>
      </aside>
      <main className="app-main">{onOpenSettings && <button className="settings-button" type="button" onClick={onOpenSettings} aria-label="Settings">☰</button>}{context}{children}</main>
      <BottomNav active={active} onNavigate={onNavigate} />
    </div>
  );
}
