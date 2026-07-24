"use client";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoonIcon, navItems, SunIcon } from "./NavItems";

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
                pathname === href
                  ? "bg-lift font-medium text-ink border-l-2 border-ink"
                  : "text-ink-3 hover:bg-lift hover:text-ink"
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
          {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          <span>{theme === "dark" ? "Светла тема" : "Тъмна тема"}</span>
        </button>
      </div>
    </aside>
  );
}
