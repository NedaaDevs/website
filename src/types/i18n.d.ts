import { DefineLocaleMessage } from 'vue-i18n'

// types
import type { MessageSchema } from '@/types/locale'

declare module 'vue-i18n' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefineLocaleMessage extends MessageSchema {}
}
