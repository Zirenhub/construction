"use client";
import { useTheme } from "@/components/ThemeProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MoonIcon, navItems, SunIcon } from "./NavItems";

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
            ${pathname === href ? "text-ink" : "text-ink-4 hover:text-ink-2"}`}
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
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
        <span>Тема</span>
      </button>
    </nav>
  );
}
