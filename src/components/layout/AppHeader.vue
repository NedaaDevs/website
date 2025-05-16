<script setup lang="ts">
import { ref, computed } from 'vue'

//
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'

// Components
import LocaleSwitch from '@/components/ui/LocaleSwitch.vue'
import ThemeSwitch from '@/components/ui/ThemeSwitch.vue'

// Icons
import { mdiMenu } from '@mdi/js'

// Stores
import { useAppStore } from '@/stores/app'

import logo from '@/assets/logo.png'
import logoDark from '@/assets/logo-dark.png'
import { storeToRefs } from 'pinia'

type NavLink = {
  title: string
  to: string
  exact?: boolean
}

const { t } = useI18n()
const { mobile } = useDisplay()
const drawer = ref(false)

const { theme } = storeToRefs(useAppStore())

const navLinks = computed<NavLink[]>(() => [
  { title: t('nav.features'), to: '#features' },
  // { title: t('nav.download'), to: '#download' },
  // { title: t('nav.openSource'), to: '#open-source' },
  { title: t('nav.translate'), to: '#translate' },
])

const logoSrc = computed(() => (theme.value === 'dark' ? logoDark : logo))
</script>

<template>
  <VAppBar app elevation="1" color="surface" :height="70">
    <VContainer class="d-flex align-center py-0">
      <!-- Logo -->
      <router-link to="/" class="d-flex align-center text-decoration-none position-relative">
        <VImg :src="logoSrc" alt="Logo" height="36" width="auto" max-width="90" />
        <span class="text-h6 font-weight-bold text-primary logo-text">{{ t('app.name') }}</span>
      </router-link>

      <VSpacer />

      <!-- Navigation Links (Desktop) -->
      <div v-if="!mobile" class="d-none d-md-flex">
        <a
          v-for="link in navLinks"
          :key="link.to"
          :href="link.to"
          class="text-decoration-none mx-3 nav-link"
        >
          {{ link.title }}
        </a>
      </div>

      <div class="d-flex align-center">
        <LocaleSwitch class="mr-2" />
        <ThemeSwitch class="mr-2" />

        <!-- Mobile Menu Button -->
        <VBtn v-if="mobile" icon @click="drawer = !drawer">
          <VIcon :icon="mdiMenu" />
        </VBtn>
      </div>
    </VContainer>
  </VAppBar>

  <!-- Mobile Navigation Drawer -->
  <VNavigationDrawer v-model="drawer" temporary location="right">
    <VList>
      <VListItem v-for="link in navLinks" :key="link.to" :href="link.to" @click="drawer = false">
        <VListItemTitle>{{ link.title }}</VListItemTitle>
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>

<style scoped>
.nav-link {
  position: relative;
  color: rgb(var(--v-theme-text));
  transition: color 0.3s ease;
}

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: rgb(var(--v-theme-primary));
  transition: width 0.3s ease;
}

.nav-link:hover {
  color: rgb(var(--v-theme-primary));
}

.nav-link:hover::after {
  width: 100%;
}
</style>
