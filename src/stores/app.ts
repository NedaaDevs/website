import { ref } from 'vue'

import { defineStore } from 'pinia'
import { useLocale, useTheme } from 'vuetify'
import { useI18n } from 'vue-i18n'

export const useAppStore = defineStore('app', () => {
  const { locale: i18nLocale, t } = useI18n()
  const { current: vuetifyLocale } = useLocale()
  const vuetifyTheme = useTheme()

  const theme = ref(vuetifyTheme.global.name.value ?? 'light')
  const locale = ref('en')

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    vuetifyTheme.global.name.value = theme.value
  }

  const setLocale = (newLocale: string) => {
    locale.value = newLocale
    i18nLocale.value = locale.value
    vuetifyLocale.value = locale.value
  }

  return {
    theme,
    locale,
    toggleTheme,
    setLocale,
  }
})
