'use client';

import { ThemeProvider } from 'next-themes';

export function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme={false}
      themes={['light', 'dark', 'ocean', 'sunset']}
    >
      {children}
    </ThemeProvider>
  );
}