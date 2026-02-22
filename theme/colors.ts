/**
 * Corporate deep blue palette (single source of truth).
 * Tailwind and CSS variables consume this.
 * Primary: #1D4ED8, Dark: #1E3A8A, Soft: #60A5FA
 * Hero gradient: #0B1B3A -> #0F2C5C
 */
export const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  primaryDark: '#1e3a8a',
  primaryBright: '#2563eb',
  primaryLight: '#60a5fa',
  heroGradient: {
    from: '#0b1b3a',
    to: '#0f2c5c',
  },
  accent: {
    DEFAULT: '#2563eb',
    foreground: '#ffffff',
  },
  neutral: {
    slate: true,
  },
} as const;

export type ThemeColors = typeof colors;
