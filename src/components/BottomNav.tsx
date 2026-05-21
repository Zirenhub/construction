'use client';
import { useTheme } from '@/components/ThemeProvider';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/obekti', label: 'Обекти', icon: '🏗️' },
  { href: '/brigadi', label: 'Бригади', icon: '👷' },
  { href: '/avansi', label: 'Аванси', icon: '💰' },
];

function SunIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="5" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

export default function BottomNav() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-line
      flex md:hidden"
    >
      {navItems.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs transition-colors
            ${
              pathname.startsWith(href)
                ? 'text-ink'
                : 'text-ink-4 hover:text-ink-2'
            }`}
        >
          <span className="text-lg leading-none">{icon}</span>
          <span>{label}</span>
        </Link>
      ))}
      <button
        onClick={toggle}
        className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs
          text-ink-4 hover:text-ink-2 transition-colors"
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        <span>Тема</span>
      </button>
    </nav>
  );
}
