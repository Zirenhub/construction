'use client';

import { ThemeProvider as NextThemesProvider } from '@wrksz/themes';
import { useTheme as useNextTheme } from '@wrksz/themes/client';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

export function useTheme() {
  const { resolvedTheme, setTheme } = useNextTheme();
  return {
    theme: resolvedTheme as 'dark' | 'light',
    toggle: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
  };
}
