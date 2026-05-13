import { NavLink } from 'react-router-dom';
import { useTranslation } from '../../lib/i18n';

const navItems = [
  {
    to: '/',
    label: 'Today',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
  {
    to: '/mass',
    label: 'Mass',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L8 7h8l-4-5z" />
        <rect x="6" y="7" width="12" height="2" rx="1" />
        <path d="M10 9v11c0 1 1 2 2 2s2-1 2-2V9" />
        <path d="M8 14h8" />
      </svg>
    ),
  },
  {
    to: '/prayers',
    label: 'Pray',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <path d="M12 3c0 4.97 4 9 4 9s4-4.03 4-9a4 4 0 0 0-8 0z" />
        <path d="M12 3c0 4.97-4 9-4 9s-4-4.03-4-9a4 4 0 0 1 8 0z" />
      </svg>
    ),
  },
  {
    to: '/rosary',
    label: 'Rosary',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="4" r="2" />
        <circle cx="6" cy="8" r="2" />
        <circle cx="18" cy="8" r="2" />
        <circle cx="4" cy="14" r="2" />
        <circle cx="20" cy="14" r="2" />
        <circle cx="8" cy="19" r="2" />
        <circle cx="16" cy="19" r="2" />
        <path d="M12 20v2" />
        <path d="M12 22l-1 2" />
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'More',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
    ),
  },
];

export function BottomNav() {
  const { t } = useTranslation();
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === '/'}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          aria-label={t(item.label)}
        >
          {item.icon}
          <span>{t(item.label)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
