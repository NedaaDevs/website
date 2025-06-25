<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// Components
import SectionContainer from '@/components/sections/SectionContainer.vue'

// Icons
import {
  mdiClockOutline,
  mdiMapMarkerOutline,
  mdiVolumeHigh,
  mdiWeatherNight,
  mdiCellphoneOff,
  mdiPalette,
} from '@mdi/js'

type Props = {
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  id: 'features',
})

const { t } = useI18n()

const features = [
  {
    icon: mdiClockOutline,
    titleKey: 'features.list.accurateTimes.title',
    descriptionKey: 'features.list.accurateTimes.description',
  },
  {
    icon: mdiMapMarkerOutline,
    titleKey: 'features.list.locationBased.title',
    descriptionKey: 'features.list.locationBased.description',
  },
  {
    icon: mdiVolumeHigh,
    titleKey: 'features.list.notifications.title',
    descriptionKey: 'features.list.notifications.description',
  },
  {
    icon: mdiWeatherNight,
    titleKey: 'features.list.darkMode.title',
    descriptionKey: 'features.list.darkMode.description',
  },
  {
    icon: mdiCellphoneOff,
    titleKey: 'features.list.offline.title',
    descriptionKey: 'features.list.offline.description',
  },
  {
    icon: mdiPalette,
    titleKey: 'features.list.design.title',
    descriptionKey: 'features.list.design.description',
  },
]
</script>

<template>
  <SectionContainer :id="props.id" paddingY="large">
    <VContainer>
      <VRow>
        <VCol cols="12" class="text-center mb-8">
          <h2 class="text-h3 font-weight-bold mb-4">{{ t('nav.features') }}</h2>
          <p
            class="text-h6 text-medium-emphasis max-width-600 mx-auto"
            style="white-space: normal; word-wrap: break-word"
          >
            {{ t('features.subtitle') }}
          </p>
        </VCol>
      </VRow>

      <VRow>
        <VCol
          v-for="feature in features"
          :key="feature.titleKey"
          cols="12"
          sm="6"
          lg="4"
          class="mb-4"
        >
          <VCard class="h-100 theme-transition hover-card" elevation="2" rounded="lg">
            <VCardItem class="text-center pa-6">
              <div class="mb-4">
                <VIcon :icon="feature.icon" size="48" color="primary" />
              </div>
              <VCardTitle class="text-h6 font-weight-bold mb-3">
                {{ t(feature.titleKey) }}
              </VCardTitle>
              <VCardText
                class="text-body-2 text-medium-emphasis"
                style="white-space: normal; word-wrap: break-word"
              >
                {{ t(feature.descriptionKey) }}
              </VCardText>
            </VCardItem>
          </VCard>
        </VCol>
      </VRow>
    </VContainer>
  </SectionContainer>
</template>

<style scoped>
.hover-card {
  transition:
    transform 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
}

.hover-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.max-width-600 {
  max-width: 600px;
}
</style>
