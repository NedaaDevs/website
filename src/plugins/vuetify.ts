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
  },
})
