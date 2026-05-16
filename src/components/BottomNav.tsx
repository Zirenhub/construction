'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/obekti', label: 'Обекти', icon: '🏗️' },
  { href: '/brigadi', label: 'Бригади', icon: '👷' },
  { href: '/avansi', label: 'Аванси', icon: '💰' },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-zinc-900 border-t border-zinc-800
      flex md:hidden"
    >
      {navItems.map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs transition-colors
            ${
              pathname.startsWith(href)
                ? 'text-white'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
        >
          <span className="text-lg leading-none">{icon}</span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
