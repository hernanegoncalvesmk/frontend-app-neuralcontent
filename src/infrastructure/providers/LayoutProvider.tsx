/**
 * @fileoverview Layout Provider
 * 
 * Layout context provider that manages UI layout state.
 * 
 * @version 1.0.0
 * @domain shared
 */

'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// ================================
// Types
// ================================
interface LayoutState {
  sidebarCollapsed: boolean;
  sidebarWidth: number;
  theme: 'light' | 'dark' | 'auto';
  isMobile: boolean;
  headerHeight: number;
  footerHeight: number;
}

interface LayoutContextType extends LayoutState {
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarWidth: (width: number) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
  setIsMobile: (isMobile: boolean) => void;
}

// ================================
// Actions
// ================================
type LayoutAction =
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR_COLLAPSED'; payload: boolean }
  | { type: 'SET_SIDEBAR_WIDTH'; payload: number }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' | 'auto' }
  | { type: 'SET_IS_MOBILE'; payload: boolean };

// ================================
// Reducer
// ================================
function layoutReducer(state: LayoutState, action: LayoutAction): LayoutState {
  switch (action.type) {
    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };
    case 'SET_SIDEBAR_COLLAPSED':
      return { ...state, sidebarCollapsed: action.payload };
    case 'SET_SIDEBAR_WIDTH':
      return { ...state, sidebarWidth: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_IS_MOBILE':
      return { ...state, isMobile: action.payload };
    default:
      return state;
  }
}

// ================================
// Initial State
// ================================
const initialState: LayoutState = {
  sidebarCollapsed: false,
  sidebarWidth: 280,
  theme: 'light',
  isMobile: false,
  headerHeight: 64,
  footerHeight: 60,
};

// ================================
// Context
// ================================
const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

// ================================
// Provider Component
// ================================
export default function LayoutProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(layoutReducer, initialState);

  // Initialize layout state
  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null;
    if (savedTheme) {
      dispatch({ type: 'SET_THEME', payload: savedTheme });
    }

    // Load sidebar state from localStorage
    const savedSidebarCollapsed = localStorage.getItem('sidebarCollapsed');
    if (savedSidebarCollapsed !== null) {
      dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: savedSidebarCollapsed === 'true' });
    }

    // Check for mobile
    const checkMobile = () => {
      const isMobile = window.innerWidth < 768;
      dispatch({ type: 'SET_IS_MOBILE', payload: isMobile });
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Save theme to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('theme', state.theme);
    // Apply theme class to document
    document.documentElement.classList.remove('light', 'dark');
    if (state.theme !== 'auto') {
      document.documentElement.classList.add(state.theme);
    } else {
      // Handle auto theme based on system preference
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(isDark ? 'dark' : 'light');
    }
  }, [state.theme]);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', state.sidebarCollapsed.toString());
  }, [state.sidebarCollapsed]);

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setSidebarCollapsed = (collapsed: boolean) => {
    dispatch({ type: 'SET_SIDEBAR_COLLAPSED', payload: collapsed });
  };

  const setSidebarWidth = (width: number) => {
    dispatch({ type: 'SET_SIDEBAR_WIDTH', payload: width });
  };

  const setTheme = (theme: 'light' | 'dark' | 'auto') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  const setIsMobile = (isMobile: boolean) => {
    dispatch({ type: 'SET_IS_MOBILE', payload: isMobile });
  };

  const contextValue: LayoutContextType = {
    ...state,
    toggleSidebar,
    setSidebarCollapsed,
    setSidebarWidth,
    setTheme,
    setIsMobile,
  };

  return (
    <LayoutContext.Provider value={contextValue}>
      {children}
    </LayoutContext.Provider>
  );
}

// ================================
// Hook
// ================================
export function useLayout(): LayoutContextType {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
}
