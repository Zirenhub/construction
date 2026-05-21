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
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="5" />
      <path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  return (
    <aside className="hidden md:flex w-52 bg-surface border-r border-line flex-col py-5 shrink-0">
      <div className="px-5 mb-6 text-[15px] font-medium tracking-tight text-ink">
        Строеж <span className="text-ink-4 font-normal">Pro</span>
      </div>
      <nav className="flex flex-col gap-0.5">
        {navItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-5 py-2.5 text-sm transition-colors
              ${
                pathname.startsWith(href)
                  ? 'bg-lift font-medium text-ink border-l-2 border-ink'
                  : 'text-ink-3 hover:bg-lift hover:text-ink'
              }`}
          >
            <span>{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      <div className="mt-auto px-3 py-4 border-t border-line">
        <button
          onClick={toggle}
          className="flex items-center gap-2.5 w-full px-2 py-2 text-sm text-ink-4
            hover:text-ink rounded-lg hover:bg-lift transition-colors"
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          <span>{theme === 'dark' ? 'Светла тема' : 'Тъмна тема'}</span>
        </button>
      </div>
    </aside>
  );
}
