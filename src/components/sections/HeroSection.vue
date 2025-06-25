<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

//
import SectionContainer from '@/components/sections/SectionContainer.vue'

// Icons
import { mdiRocketLaunchOutline } from '@mdi/js'

// Stores
import { useAppStore } from '@/stores/app'
import { storeToRefs } from 'pinia'

// Assets
import logo from '@/assets/logo.png'
import logoDark from '@/assets/logo-dark.png'

type Props = {
  id?: string
  logoHeight?: number
  maxWidth?: number | string
  ctaTarget?: string
  background?: 'default' | 'primary' | 'surface' | 'gradient'
}

const props = withDefaults(defineProps<Props>(), {
  id: 'hero',
  logoHeight: 150,
  maxWidth: 800,
  ctaTarget: '#download',
  background: 'default',
})

const { t } = useI18n()
const { theme } = storeToRefs(useAppStore())

const logoSrc = computed(() => (theme.value === 'dark' ? logoDark : logo))

const textColorClass = computed(() => {
  if (props.background === 'gradient' || props.background === 'primary') {
    return 'text-on-primary'
  }
  return theme.value === 'dark' ? 'text-on-surface' : 'text-on-background'
})

const buttonVariant = computed(() => {
  if (props.background === 'gradient' || props.background === 'primary') {
    return theme.value === 'dark' ? 'elevated' : 'tonal'
  }
  return 'elevated'
})
</script>

<template>
  <SectionContainer
    :id="props.id"
    :background="props.background"
    paddingY="large"
    :fullHeight="true"
    :showArrowImmediately="true"
    :hideArrowOnScroll="true"
    class="theme-transition"
  >
    <VContainer class="h-100 d-flex align-center">
      <VResponsive class="mx-auto text-center px-4" :max-width="props.maxWidth">
        <VImg
          class="mb-4 mx-auto logo-image"
          :height="props.logoHeight"
          :src="logoSrc"
          :alt="t('app.name')"
          transition="fade-transition"
        />

        <div class="text-center theme-transition">
          <div
            :class="['text-body-2 font-weight-light mb-n1 theme-transition-text', textColorClass]"
          >
            {{ t('common.welcomeTo') }}
          </div>
          <h1 :class="['text-h2 font-weight-bold theme-transition-text', textColorClass]">
            {{ t('app.name') }}
          </h1>
          <p
            :class="['text-body-1 mt-4 theme-transition-text', textColorClass]"
            style="white-space: normal; word-wrap: break-word"
          >
            {{ t('app.description') }}
          </p>
        </div>

        <!-- CTA Button -->
        <div class="mt-8 pb-2">
          <VBtn
            size="large"
            color="primary"
            :variant="buttonVariant"
            rounded="pill"
            :prepend-icon="mdiRocketLaunchOutline"
            :href="props.ctaTarget"
            class="hover-feedback text-body-1 font-weight-bold"
            elevation="2"
          >
            {{ t('cta.downloadNow') }}
          </VBtn>
        </div>

        <!-- Optional Slot for Additional Content -->
        <slot></slot>
      </VResponsive>
    </VContainer>
  </SectionContainer>
</template>
