<script setup lang="ts">
import { useI18n } from 'vue-i18n'

//
import SectionContainer from '@/components/sections/SectionContainer.vue'

// Icons
import { mdiRocketLaunchOutline } from '@mdi/js'

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
</script>

<template>
  <SectionContainer
    :id="props.id"
    :background="props.background"
    paddingY="large"
    :fullHeight="true"
  >
    <VContainer class="h-100 d-flex align-center">
      <VResponsive class="mx-auto text-center" :max-width="props.maxWidth">
        <VImg class="mb-4 mx-auto" :height="props.logoHeight" src="@/assets/logo.png" />

        <div class="text-center">
          <div class="text-body-2 font-weight-light mb-n1">{{ t('common.welcomeTo') }}</div>
          <h1 class="text-h2 font-weight-bold">{{ t('app.name') }}</h1>
          <p class="text-body-1 mt-4">{{ t('app.description') }}</p>
        </div>

        <!-- CTA Button -->
        <div class="mt-8">
          <VBtn
            size="large"
            color="primary"
            rounded="pill"
            :prepend-icon="mdiRocketLaunchOutline"
            :href="props.ctaTarget"
          >
            {{ t('cta.getStarted') }}
          </VBtn>
        </div>

        <!-- Optional Slot for Additional Content -->
        <slot></slot>
      </VResponsive>
    </VContainer>
  </SectionContainer>
</template>
