/**
 * @fileoverview UI Constants
 * 
 * Constants related to user interface components, styling, and interactions.
 * 
 * @version 1.0.0
 * @domain shared
 */

// ================================
// Color Palette
// ================================
export const COLORS = {
  // Primary Colors
  PRIMARY: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main primary
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Secondary Colors
  SECONDARY: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b', // Main secondary
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
  },
  
  // Semantic Colors
  SUCCESS: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main success
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  
  WARNING: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b', // Main warning
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  
  ERROR: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main error
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  
  INFO: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main info
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  
  // Neutral Colors
  GRAY: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
  },
} as const;

// ================================
// Typography
// ================================
export const TYPOGRAPHY = {
  FONT_FAMILIES: {
    PRIMARY: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    MONOSPACE: 'Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    SERIF: 'Georgia, "Times New Roman", Times, serif',
  },
  
  FONT_SIZES: {
    XS: '0.75rem', // 12px
    SM: '0.875rem', // 14px
    BASE: '1rem', // 16px
    LG: '1.125rem', // 18px
    XL: '1.25rem', // 20px
    '2XL': '1.5rem', // 24px
    '3XL': '1.875rem', // 30px
    '4XL': '2.25rem', // 36px
    '5XL': '3rem', // 48px
    '6XL': '3.75rem', // 60px
  },
  
  FONT_WEIGHTS: {
    THIN: '100',
    EXTRALIGHT: '200',
    LIGHT: '300',
    NORMAL: '400',
    MEDIUM: '500',
    SEMIBOLD: '600',
    BOLD: '700',
    EXTRABOLD: '800',
    BLACK: '900',
  },
  
  LINE_HEIGHTS: {
    NONE: '1',
    TIGHT: '1.25',
    SNUG: '1.375',
    NORMAL: '1.5',
    RELAXED: '1.625',
    LOOSE: '2',
  },
  
  LETTER_SPACINGS: {
    TIGHTER: '-0.05em',
    TIGHT: '-0.025em',
    NORMAL: '0em',
    WIDE: '0.025em',
    WIDER: '0.05em',
    WIDEST: '0.1em',
  },
} as const;

// ================================
// Spacing System
// ================================
export const SPACING = {
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  1.5: '0.375rem', // 6px
  2: '0.5rem', // 8px
  2.5: '0.625rem', // 10px
  3: '0.75rem', // 12px
  3.5: '0.875rem', // 14px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  7: '1.75rem', // 28px
  8: '2rem', // 32px
  9: '2.25rem', // 36px
  10: '2.5rem', // 40px
  11: '2.75rem', // 44px
  12: '3rem', // 48px
  14: '3.5rem', // 56px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  28: '7rem', // 112px
  32: '8rem', // 128px
  36: '9rem', // 144px
  40: '10rem', // 160px
  44: '11rem', // 176px
  48: '12rem', // 192px
  52: '13rem', // 208px
  56: '14rem', // 224px
  60: '15rem', // 240px
  64: '16rem', // 256px
  72: '18rem', // 288px
  80: '20rem', // 320px
  96: '24rem', // 384px
} as const;

// ================================
// Border Radius
// ================================
export const BORDER_RADIUS = {
  NONE: '0',
  SM: '0.125rem', // 2px
  DEFAULT: '0.25rem', // 4px
  MD: '0.375rem', // 6px
  LG: '0.5rem', // 8px
  XL: '0.75rem', // 12px
  '2XL': '1rem', // 16px
  '3XL': '1.5rem', // 24px
  FULL: '9999px',
} as const;

// ================================
// Shadow System
// ================================
export const SHADOWS = {
  NONE: 'none',
  SM: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  MD: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  LG: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  XL: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2XL': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  INNER: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
} as const;

// ================================
// Breakpoints
// ================================
export const BREAKPOINTS = {
  XS: '475px',
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px',
} as const;

// ================================
// Z-Index Layers
// ================================
export const Z_INDEX = {
  HIDE: -1,
  AUTO: 'auto',
  BASE: 0,
  BELOW: 1,
  NORMAL: 10,
  TOOLTIP: 20,
  DROPDOWN: 30,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  NOTIFICATION: 60,
  LOADING: 70,
  DEBUG: 9999,
} as const;

// ================================
// Animation Durations
// ================================
export const ANIMATION = {
  DURATION: {
    FAST: '150ms',
    NORMAL: '300ms',
    SLOW: '500ms',
    SLOWER: '750ms',
    SLOWEST: '1000ms',
  },
  
  TIMING: {
    LINEAR: 'linear',
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
    EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  
  DELAYS: {
    NONE: '0ms',
    SHORT: '75ms',
    MEDIUM: '150ms',
    LONG: '300ms',
  },
} as const;

// ================================
// Component Sizes
// ================================
export const COMPONENT_SIZES = {
  XS: {
    height: '1.5rem', // 24px
    padding: '0.25rem 0.5rem', // 4px 8px
    fontSize: '0.75rem', // 12px
  },
  SM: {
    height: '2rem', // 32px
    padding: '0.375rem 0.75rem', // 6px 12px
    fontSize: '0.875rem', // 14px
  },
  MD: {
    height: '2.5rem', // 40px
    padding: '0.5rem 1rem', // 8px 16px
    fontSize: '1rem', // 16px
  },
  LG: {
    height: '3rem', // 48px
    padding: '0.75rem 1.25rem', // 12px 20px
    fontSize: '1.125rem', // 18px
  },
  XL: {
    height: '3.5rem', // 56px
    padding: '1rem 1.5rem', // 16px 24px
    fontSize: '1.25rem', // 20px
  },
} as const;

// ================================
// Layout Constants
// ================================
export const LAYOUT = {
  SIDEBAR: {
    WIDTH_COLLAPSED: '64px',
    WIDTH_EXPANDED: '280px',
    TRANSITION: 'width 300ms ease-in-out',
  },
  
  HEADER: {
    HEIGHT: '64px',
    MOBILE_HEIGHT: '56px',
  },
  
  FOOTER: {
    HEIGHT: '60px',
  },
  
  CONTAINER: {
    MAX_WIDTH: '1200px',
    PADDING: '1rem',
  },
  
  GRID: {
    COLUMNS: 12,
    GAP: '1rem',
  },
} as const;

// ================================
// Form Constants
// ================================
export const FORM = {
  INPUT: {
    HEIGHT: '2.5rem', // 40px
    BORDER_WIDTH: '1px',
    BORDER_RADIUS: '0.375rem', // 6px
  },
  
  TEXTAREA: {
    MIN_HEIGHT: '6rem', // 96px
    RESIZE: 'vertical',
  },
  
  LABEL: {
    MARGIN_BOTTOM: '0.5rem', // 8px
    FONT_WEIGHT: '500',
  },
  
  ERROR: {
    FONT_SIZE: '0.875rem', // 14px
    COLOR: '#ef4444', // red-500
    MARGIN_TOP: '0.25rem', // 4px
  },
  
  HELP_TEXT: {
    FONT_SIZE: '0.875rem', // 14px
    COLOR: '#64748b', // slate-500
    MARGIN_TOP: '0.25rem', // 4px
  },
} as const;

// ================================
// Table Constants
// ================================
export const TABLE = {
  CELL: {
    PADDING: '0.75rem 1rem', // 12px 16px
    BORDER_WIDTH: '1px',
  },
  
  HEADER: {
    FONT_WEIGHT: '600',
    BACKGROUND: '#f8fafc', // slate-50
  },
  
  ROW: {
    HOVER_BACKGROUND: '#f1f5f9', // slate-100
    SELECTED_BACKGROUND: '#e0f2fe', // sky-100
  },
} as const;

// ================================
// Modal Constants
// ================================
export const MODAL = {
  BACKDROP: {
    BACKGROUND: 'rgba(0, 0, 0, 0.5)',
    BACKDROP_FILTER: 'blur(4px)',
  },
  
  SIZES: {
    XS: '320px',
    SM: '384px',
    MD: '512px',
    LG: '768px',
    XL: '1024px',
    FULL: '100vw',
  },
  
  ANIMATION: {
    DURATION: '300ms',
    TIMING: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ================================
// Notification Constants
// ================================
export const NOTIFICATION = {
  POSITIONS: {
    TOP_LEFT: 'top-left',
    TOP_RIGHT: 'top-right',
    TOP_CENTER: 'top-center',
    BOTTOM_LEFT: 'bottom-left',
    BOTTOM_RIGHT: 'bottom-right',
    BOTTOM_CENTER: 'bottom-center',
  },
  
  DURATIONS: {
    SHORT: 3000, // 3 seconds
    MEDIUM: 5000, // 5 seconds
    LONG: 8000, // 8 seconds
    PERSISTENT: 0, // Does not auto-dismiss
  },
  
  MAX_COUNT: 5,
  
  SPACING: '0.5rem', // 8px between notifications
} as const;

// ================================
// Loading States
// ================================
export const LOADING = {
  SPINNER: {
    SIZE: {
      XS: '1rem', // 16px
      SM: '1.5rem', // 24px
      MD: '2rem', // 32px
      LG: '3rem', // 48px
      XL: '4rem', // 64px
    },
    THICKNESS: '2px',
  },
  
  SKELETON: {
    BORDER_RADIUS: '0.25rem', // 4px
    ANIMATION_DURATION: '1.5s',
  },
  
  OVERLAY: {
    BACKGROUND: 'rgba(255, 255, 255, 0.8)',
    BACKDROP_FILTER: 'blur(2px)',
  },
} as const;

// ================================
// Icon System
// ================================
export const ICONS = {
  SIZES: {
    XS: '1rem', // 16px
    SM: '1.25rem', // 20px
    MD: '1.5rem', // 24px
    LG: '2rem', // 32px
    XL: '2.5rem', // 40px
    '2XL': '3rem', // 48px
  },
  
  STROKE_WIDTH: {
    THIN: '1',
    NORMAL: '1.5',
    THICK: '2',
  },
} as const;
