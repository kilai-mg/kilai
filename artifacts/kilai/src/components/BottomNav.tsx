import { motion } from 'framer-motion';
import { Sprout, Users, Package, BookOpen, Leaf } from 'lucide-react';

export type SectionId =
  | 'ritual'    // the 6-screen swipe flow
  | 'about'
  | 'bulk'
  | 'blogs'
  | 'kids';

interface NavItem {
  id: SectionId;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'ritual', label: 'Adopt',   icon: Sprout },
  { id: 'bulk',   label: 'Bulk',    icon: Package },
  { id: 'blogs',  label: 'Journal', icon: BookOpen },
  { id: 'kids',   label: 'Kids',    icon: Leaf },
  { id: 'about',  label: 'About',   icon: Users },
];

interface BottomNavProps {
  active: SectionId;
  onChange: (id: SectionId) => void;
}

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex items-stretch"
      style={{
        background: 'rgba(8,15,10,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(168,201,138,0.08)',
        height: '60px',
      }}
      data-testid="bottom-nav"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = active === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            data-testid={`nav-tab-${item.id}`}
            className="flex-1 flex flex-col items-center justify-center gap-1 relative transition-all duration-200"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: isActive ? 'var(--kilai-sprout)' : 'rgba(241,236,221,0.28)',
              outline: 'none',
            }}
          >
            {/* Active indicator line */}
            {isActive && (
              <motion.div
                layoutId="nav-indicator"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '20%',
                  right: '20%',
                  height: '1.5px',
                  background: 'var(--kilai-sprout)',
                  borderRadius: '0 0 2px 2px',
                }}
              />
            )}
            <Icon
              size={17}
              strokeWidth={isActive ? 1.8 : 1.4}
            />
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '0.52rem',
                letterSpacing: '0.08em',
                lineHeight: 1,
                opacity: isActive ? 1 : 0.6,
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
