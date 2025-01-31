<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// Components
import LocaleSwitch from '@/components/common/LocaleSwitch.vue'
import ThemeSwitch from '@/components/common/ThemeSwitch.vue'

// Icon
import { mdiRocketLaunchOutline } from '@mdi/js'

const { t } = useI18n()
</script>

<template>
  <VContainer class="fill-height">
    <div class="controls position-fixed top-0 right-0 pa-4">
      <LocaleSwitch class="mr-2" />
      <ThemeSwitch />
    </div>
    <VResponsive class="align-centerfill-height mx-auto" max-width="900">
      <VImg class="mb-4" height="150" src="@/assets/logo.png" />

      <div class="text-center">
        <div class="text-body-2 font-weight-light mb-n1">{{ t('welcomeTo') }}</div>

        <h1 class="text-h2 font-weight-bold">{{ t('nedaa') }}</h1>
      </div>

      <div class="py-4" />

      <VRow>
        <VCol cols="12">
          <VCard
            class="py-4"
            color="surface-variant"
            image="https://cdn.vuetifyjs.com/docs/images/one/create/feature.png"
            :prepend-icon="mdiRocketLaunchOutline"
            rounded="lg"
            variant="outlined"
          >
            <template #image>
              <VImg position="top right" />
            </template>

            <VOverlay opacity=".12" scrim="primary" contained model-value persistent />
          </VCard>
        </VCol>
      </VRow>
    </VResponsive>
  </VContainer>
</template>
