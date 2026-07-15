/**
 * Uber-inspired black & white design system with Sora typeface.
 * White is the base — black is used for emphasis and active states.
 */

import '@/global.css';

import { Platform } from 'react-native';

// ─── Colour Tokens ────────────────────────────────────────────────────────────
// We force a single "always light" palette as requested.
export const Colors = {
  light: {
    // Surfaces
    background: '#FFFFFF',
    backgroundElement: '#F6F6F6',
    backgroundSelected: '#000000',
    // Text
    text: '#000000',
    textSecondary: '#6B6B6B',
    // Tab bar
    tabBar: '#FFFFFF',
    tabBarBorder: '#E8E8E8',
    tabActive: '#000000',
    tabInactive: '#9E9E9E',
    // Accent (kept minimal — Uber style)
    accent: '#000000',
  },
  // Dark palette mirrors light so the rest of the codebase compiles without
  // changes; we always force light mode in the layout.
  dark: {
    background: '#FFFFFF',
    backgroundElement: '#F6F6F6',
    backgroundSelected: '#000000',
    text: '#000000',
    textSecondary: '#6B6B6B',
    tabBar: '#FFFFFF',
    tabBarBorder: '#E8E8E8',
    tabActive: '#000000',
    tabInactive: '#9E9E9E',
    accent: '#000000',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// ─── Typography ───────────────────────────────────────────────────────────────
export const Fonts = Platform.select({
  ios: {
    sans: 'Sora',
    serif: 'Georgia',
    rounded: 'Sora',
    mono: 'Courier New',
  },
  default: {
    sans: 'Sora',
    serif: 'serif',
    rounded: 'Sora',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

// ─── Spacing ─────────────────────────────────────────────────────────────────
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
