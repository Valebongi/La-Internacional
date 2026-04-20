import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import PricingAutoSync from '@/components/shared/PricingAutoSync';

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="lid-shell">
      <PricingAutoSync />
      <Sidebar />
      <div className="lid-shell-main">
        <TopBar />
        <div className="lid-shell-content">{children}</div>
      </div>
    </div>
  );
}
