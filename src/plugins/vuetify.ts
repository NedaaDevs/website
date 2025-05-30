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
          primary: '#1e3c5a',
          'primary-50': '#f0f4f7',
          'primary-100': '#d9e2e9',
          'primary-200': '#b3c5d3',
          'primary-300': '#8da8bd',
          'primary-400': '#668ba7',
          'primary-600': '#183048',
          'primary-700': '#122436',
          'primary-800': '#0c1824',
          'primary-900': '#060c12',

          secondary: '#e5cb87',
          'secondary-50': '#fdf9f0',
          'secondary-100': '#f9efd7',
          'secondary-200': '#f3dfaf',
          'secondary-300': '#edcf87',
          'secondary-400': '#e7bf5f',
          'secondary-600': '#b7a26c',
          'secondary-700': '#897a51',
          'secondary-800': '#5b5136',
          'secondary-900': '#2e281b',

          tertiary: '#bfc4cd',
          'tertiary-50': '#f6f7f9',
          'tertiary-100': '#eceef2',
          'tertiary-200': '#e2e5eb',
          'tertiary-300': '#d3d8e1',
          'tertiary-600': '#aaafb9',
          'tertiary-700': '#8c919b',
          'tertiary-800': '#6e737d',
          'tertiary-900': '#50555f',

          error: '#ef4444',
          success: '#348352',
          warning: '#e77828',
          info: '#0da6f2',

          background: '#f5f8fa',
          surface: '#ffffff',
          'surface-variant': '#ebf0f5',

          'bg-error': '#fef1f1',
          'bg-warning': '#fff3ea',
          'bg-success': '#edfcf2',
          'bg-info': '#ebf8fe',

          'on-background': '#152736',
          'on-surface': '#152736',
          'on-primary': '#ffffff',
          'on-secondary': '#152736',
          'on-tertiary': '#152736',
          'on-error': '#ffffff',
          'on-success': '#ffffff',
          'on-warning': '#ffffff',
          'on-info': '#ffffff',

          outline: '#d3dce6',
          'text-muted': '#5a6473',
        },
      },
      dark: {
        colors: {
          primary: '#e5cb87',
          'primary-50': '#fdf9f0',
          'primary-100': '#f9efd7',
          'primary-200': '#f3dfaf',
          'primary-300': '#edcf87',
          'primary-400': '#e7bf5f',
          'primary-600': '#b7a26c',
          'primary-700': '#897a51',
          'primary-800': '#5b5136',
          'primary-900': '#2e281b',

          secondary: '#1e3c5a',
          'secondary-50': '#f0f4f7',
          'secondary-100': '#d9e2e9',
          'secondary-200': '#b3c5d3',
          'secondary-300': '#8da8bd',
          'secondary-400': '#668ba7',
          'secondary-600': '#183048',
          'secondary-700': '#122436',
          'secondary-800': '#0c1824',
          'secondary-900': '#060c12',

          tertiary: '#9bb5c9',
          'tertiary-50': '#f0f5fa',
          'tertiary-100': '#e1ebf5',
          'tertiary-200': '#cddeeb',
          'tertiary-300': '#b9cde1',
          'tertiary-600': '#87a1b5',
          'tertiary-700': '#738da1',
          'tertiary-800': '#5f798d',
          'tertiary-900': '#4b6579',

          error: '#fc8181',
          success: '#489766',
          warning: '#fb954b',
          info: '#32b4f4',

          background: '#061e37',
          surface: '#082341',
          'surface-variant': '#19283c',

          'bg-error': '#4d3232',
          'bg-warning': '#4b3928',
          'bg-success': '#263a2d',
          'bg-info': '#1e3241',

          'on-background': '#f0f0f0',
          'on-surface': '#f0f0f0',
          'on-primary': '#061e37',
          'on-secondary': '#ffffff',
          'on-tertiary': '#061e37',
          'on-error': '#ffffff',
          'on-success': '#ffffff',
          'on-warning': '#061e37',
          'on-info': '#ffffff',

          outline: '#37506e',
          'text-muted': '#b4bec8',
        },
      },
    },
  },
})
