'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/obekti', label: 'Обекти', icon: '🏗️' },
  { href: '/brigadi', label: 'Бригади', icon: '👷' },
  { href: '/avansi', label: 'Аванси', icon: '💰' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-52 bg-zinc-900 border-r border-zinc-800 flex-col py-5 shrink-0">
      <div className="px-5 mb-6 text-[15px] font-medium tracking-tight text-white">
        Строеж <span className="text-zinc-500 font-normal">Pro</span>
      </div>
      <nav className="flex flex-col gap-0.5">
        {navItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2.5 px-5 py-2.5 text-sm transition-colors
              ${
                pathname.startsWith(href)
                  ? 'bg-zinc-800 font-medium text-white border-l-2 border-white'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
          >
            <span>{icon}</span>
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
