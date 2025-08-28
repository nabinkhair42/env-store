'use client';

import { AppProvider } from '@/contexts/app-context';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './theme-provider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <AppProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--sidebar)',
                color: 'var(--foreground)',
              },
            }}
          />
        </AppProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
