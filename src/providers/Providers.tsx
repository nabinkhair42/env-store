"use client";

import { SessionProvider } from "next-auth/react";
import { AppProvider } from "@/contexts/AppContext";
import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";
import { ThemeProvider } from "./theme-provider";

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
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
        </AppProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
