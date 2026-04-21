'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

interface AppContextType {
  showProjectForm: boolean;
  setShowProjectForm: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [showProjectForm, setShowProjectForm] = useState(false);

  return (
    <AppContext.Provider value={{ showProjectForm, setShowProjectForm }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
