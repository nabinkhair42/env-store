"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { IProject } from '@/lib/models/Project';

interface AppContextType {
  selectedProject: IProject | null;
  setSelectedProject: (project: IProject | null) => void;
  showProjectForm: boolean;
  setShowProjectForm: (show: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [selectedProject, setSelectedProject] = useState<IProject | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);

  const value: AppContextType = {
    selectedProject,
    setSelectedProject,
    showProjectForm,
    setShowProjectForm,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
