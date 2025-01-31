// Styles
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

const userPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

export default createVuetify({
  theme: {
    defaultTheme: userPrefersDark ? 'dark' : 'light',
  },
})
