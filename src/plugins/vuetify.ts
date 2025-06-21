// Styles
import 'vuetify/styles'

import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: userPrefersDark ? 'dark' : 'light',
    themes: {
      light: {
        colors: {
          primary: '#1c5d85',
          'primary-50': '#f5f7fa',
          'primary-100': '#e2e8f0',
          'primary-200': '#b3c5d3',
          'primary-300': '#8da8bd',
          'primary-400': '#668ba7',
          'primary-600': '#1c5d7d',
          'primary-700': '#2a4d6d',
          'primary-800': '#0c1824',
          'primary-900': '#060c12',

          secondary: '#1c5d7d',
          'secondary-50': '#f5f7fa',
          'secondary-100': '#e2e8f0',
          'secondary-200': '#b3c5d3',
          'secondary-300': '#8da8bd',
          'secondary-400': '#668ba7',
          'secondary-600': '#2a4d6d',
          'secondary-700': '#1c5d85',
          'secondary-800': '#0c1824',
          'secondary-900': '#060c12',

          // Tertiary colors (--color-tertiary: "42 77 109")
          tertiary: '#2a4d6d',
          'tertiary-50': '#f5f7fa',
          'tertiary-100': '#e2e8f0',
          'tertiary-200': '#b3c5d3',
          'tertiary-300': '#8da8bd',
          'tertiary-600': '#1c5d85',
          'tertiary-700': '#1c5d7d',
          'tertiary-800': '#0c1824',
          'tertiary-900': '#060c12',

          error: '#dc2626', // --color-error: "220 38 38"
          success: '#16a34a', // --color-success: "22 163 74"
          warning: '#d97706', // --color-warning: "217 119 6"
          info: '#2563eb', // --color-info: "37 99 235"

          background: '#f5f7fa', // --color-background: "245 247 250"
          surface: '#ffffff', // --color-background-secondary: "255 255 255"
          'surface-variant': '#f3f4f6', // --color-background-interactive: "245 247 250"

          // Background colors for status states
          'bg-error': '#fee2e2', // --color-background-error: "254 226 226"
          'bg-warning': '#fef3c7', // --color-background-warning: "254 243 199"
          'bg-success': '#dcfce7', // --color-background-success: "220 252 231"
          'bg-info': '#dbeafe', // --color-background-info: "219 234 254"

          'on-background': '#1c5d85', // --color-typography: "28 93 133"
          'on-surface': '#1c5d85',
          'on-primary': '#ffffff', // --color-typography-contrast: "255 255 255"
          'on-secondary': '#ffffff',
          'on-tertiary': '#ffffff',
          'on-error': '#ffffff',
          'on-success': '#ffffff',
          'on-warning': '#ffffff',
          'on-info': '#ffffff',

          // Border colors from nedaa theme
          outline: '#e2e8f0', // --color-outline: "226 232 240"
          'text-muted': '#64748b', // --color-typography-secondary: "100 116 139"
        },
      },
      dark: {
        colors: {
          // Primary colors from nedaa dark theme (--color-primary: "230 196 105")
          primary: '#e6c469',
          'primary-50': '#fdf9f0',
          'primary-100': '#f9efd7',
          'primary-200': '#f3dfaf',
          'primary-300': '#edcf87',
          'primary-400': '#e7bf5f',
          'primary-600': '#d4ba76', // --color-secondary: "212 186 118"
          'primary-700': '#897a51',
          'primary-800': '#5b5136',
          'primary-900': '#2e281b',

          // Secondary colors from nedaa dark theme
          secondary: '#d4ba76', // --color-secondary: "212 186 118"
          'secondary-50': '#fdf9f0',
          'secondary-100': '#f9efd7',
          'secondary-200': '#f3dfaf',
          'secondary-300': '#edcf87',
          'secondary-400': '#e7bf5f',
          'secondary-600': '#e6c469',
          'secondary-700': '#897a51',
          'secondary-800': '#5b5136',
          'secondary-900': '#2e281b',

          // Tertiary colors from nedaa dark theme (--color-tertiary: "57 62 70")
          tertiary: '#393e46',
          'tertiary-50': '#f8f9fa',
          'tertiary-100': '#e9ecef',
          'tertiary-200': '#dee2e6',
          'tertiary-300': '#ced4da',
          'tertiary-600': '#6c757d',
          'tertiary-700': '#495057',
          'tertiary-800': '#343a40',
          'tertiary-900': '#212529',

          // Status colors from nedaa dark theme
          error: '#fca5a5', // --color-error: "252 165 165"
          success: '#86efac', // --color-success: "134 239 172"
          warning: '#fcd34d', // --color-warning: "252 211 77"
          info: '#93c5fd', // --color-info: "147 197 253"

          // Background colors from nedaa dark theme
          background: '#222831', // --color-background: "34 40 49"
          surface: '#393e46', // --color-background-secondary: "57 62 70"
          'surface-variant': '#222831', // --color-background-interactive: "34 40 49"

          // Background colors for status states in dark theme
          'bg-error': '#7f1d1d', // --color-background-error: "127 29 29"
          'bg-warning': '#78350f', // --color-background-warning: "120 53 15"
          'bg-success': '#14532d', // --color-background-success: "20 83 45"
          'bg-info': '#1e3a8a', // --color-background-info: "30 58 138"

          // Text colors from nedaa dark theme
          'on-background': '#e6c469', // --color-typography: "230 196 105"
          'on-surface': '#e3e2ce', // --color-typography-secondary: "227 226 206"
          'on-primary': '#ffffff', // --color-typography-contrast: "255 255 255"
          'on-secondary': '#ffffff',
          'on-tertiary': '#e6c469',
          'on-error': '#ffffff',
          'on-success': '#ffffff',
          'on-warning': '#000000',
          'on-info': '#ffffff',

          // Border colors from nedaa dark theme
          outline: 'rgba(255, 255, 255, 0.1)', // --color-outline: "255 255 255 10" (10% opacity)
          'text-muted': '#e3e2ce', // --color-typography-secondary: "227 226 206"
        },
      },
    },
  },
})
