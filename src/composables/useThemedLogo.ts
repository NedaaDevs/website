import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/stores/app'
import logo from '@/assets/logo.png'
import logoDark from '@/assets/logo-dark.png'

export function useThemedLogo() {
  const { theme } = storeToRefs(useAppStore())
  const logoSrc = computed(() => (theme.value === 'dark' ? logoDark : logo))
  return { logoSrc }
}
