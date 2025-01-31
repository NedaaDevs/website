// Plugins
import vuetify from '@/plugins/vuetify'
import pinia from '@/stores'
import router from '@/router'
import i18n from '@/plugins/i18n'

// Types
import type { App } from 'vue'

export function registerPlugins(app: App) {
  app.use(i18n).use(vuetify).use(router).use(pinia)
}
