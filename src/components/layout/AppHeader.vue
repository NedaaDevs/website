<script setup lang="ts">
import { ref, computed } from 'vue'

//
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'

// Components
import LocaleSwitch from '@/components/ui/LocaleSwitch.vue'
import ThemeSwitch from '@/components/ui/ThemeSwitch.vue'

// Icons
import { mdiMenu } from '@mdi/js'

// Stores
import { useAppStore } from '@/stores/app'
// Assets
import logo from '@/assets/logo.png'
import logoDark from '@/assets/logo-dark.png'

// Icons
import { mdiChevronRight } from '@mdi/js'

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
  <VAppBar app elevation="2" color="surface" :height="70" class="theme-transition">
    <VContainer class="d-flex align-center py-0">
      <!-- Logo -->
      <router-link to="/" class="d-flex align-center text-decoration-none position-relative">
        <VImg
          :src="logoSrc"
          alt="Logo"
          height="36"
          width="auto"
          max-width="90"
          class="logo-image"
        />
        <span class="text-h6 font-weight-bold text-primary transition-swing">{{
          t('app.name')
        }}</span>
      </router-link>

      <VSpacer />

      <!-- Navigation Links (Desktop) -->
      <div v-if="!mobile" class="d-none d-md-flex">
        <a
          v-for="link in navLinks"
          :key="link.to"
          :href="link.to"
          class="text-decoration-none mx-3 position-relative nav-link font-weight-medium hover-feedback"
          :class="{ 'text-primary': theme === 'light', 'text-primary-darken-1': theme === 'dark' }"
        >
          {{ link.title }}
        </a>
      </div>

      <div class="d-flex align-center">
        <LocaleSwitch class="mr-2" />
        <ThemeSwitch class="mr-2" />

        <!-- Mobile Menu Button -->
        <VBtn
          v-if="mobile"
          icon
          variant="text"
          @click="drawer = !drawer"
          color="primary"
          class="ml-1 hover-feedback"
        >
          <VIcon :icon="mdiMenu" />
        </VBtn>
      </div>
    </VContainer>
  </VAppBar>

  <!-- Mobile Navigation Drawer -->
  <VNavigationDrawer
    v-model="drawer"
    temporary
    location="right"
    color="surface"
    width="280"
    elevation="4"
    class="theme-transition"
  >
    <VList bg-color="transparent" class="pa-2">
      <VListItem
        v-for="link in navLinks"
        :key="link.to"
        :href="link.to"
        @click="drawer = false"
        class="mx-2 my-1 theme-transition hover-feedback"
        color="primary"
        rounded="lg"
        active-color="primary"
      >
        <template v-slot:prepend>
          <VIcon :icon="mdiChevronRight" size="small" class="mr-2" color="primary" />
        </template>
        <VListItemTitle class="font-weight-medium">{{ link.title }}</VListItemTitle>
      </VListItem>
    </VList>
    <!-- TODO: Decide if we should move here or keep the nav buttons -->
    <!-- <template v-slot:append>
      <div class="pa-4 d-flex align-center justify-space-between">
        <LocaleSwitch />
        <ThemeSwitch />
      </div>
    </template> -->
  </VNavigationDrawer>
</template>

<style scoped>
.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px;
  left: 0;
  background-color: currentColor;
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}
</style>
