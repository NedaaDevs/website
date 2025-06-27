import { createI18n, type I18nOptions } from 'vue-i18n'

// Locales
import ar from '@/localization/ar.json'
import en from '@/localization/en.json'
import ms from '@/localization/ms.json'
import ur from '@/localization/ur.json'

const browserLocale = window.navigator.language.slice(0, 2) // take only locale e.g en from en-US

const messages = {
  ar,
  en,
  ms,
  ur,
}

const options: I18nOptions = {
  legacy: false,
  locale: browserLocale,
  fallbackLocale: 'en',
  messages,
  missingWarn: false,
  fallbackWarn: false,
}

export default createI18n<false, typeof options>(options)
