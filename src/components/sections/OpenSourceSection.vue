<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// Components
import SectionContainer from '@/components/sections/SectionContainer.vue'

// Icons
import {
  mdiGithub,
  mdiHeart,
  // mdiCodeBraces,
  mdiAccountGroup,
  mdiStar,
  mdiEye,
  mdiArrowRight,
} from '@mdi/js'

type Props = {
  id?: string
}

const props = withDefaults(defineProps<Props>(), {
  id: 'open-source',
})

const { t } = useI18n()

const openSourceFeatures = [
  {
    icon: mdiEye,
    titleKey: 'openSource.features.transparent.title',
    descriptionKey: 'openSource.features.transparent.description',
  },
  {
    icon: mdiAccountGroup,
    titleKey: 'openSource.features.community.title',
    descriptionKey: 'openSource.features.community.description',
  },
  // TODO: Uncomment after setting up artifacts CI
  // {
  //   icon: mdiCodeBraces,
  //   titleKey: 'openSource.features.modern.title',
  //   descriptionKey: 'openSource.features.modern.description'
  // },
  {
    icon: mdiHeart,
    titleKey: 'openSource.features.love.title',
    descriptionKey: 'openSource.features.love.description',
  },
]

const contributionTypes = [
  {
    titleKey: 'openSource.contribute.types.code.title',
    descriptionKey: 'openSource.contribute.types.code.description',
    actionKey: 'openSource.contribute.types.code.action',
  },
  {
    titleKey: 'openSource.contribute.types.translate.title',
    descriptionKey: 'openSource.contribute.types.translate.description',
    actionKey: 'openSource.contribute.types.translate.action',
  },
  {
    titleKey: 'openSource.contribute.types.bugs.title',
    descriptionKey: 'openSource.contribute.types.bugs.description',
    actionKey: 'openSource.contribute.types.bugs.action',
  },
  {
    titleKey: 'openSource.contribute.types.features.title',
    descriptionKey: 'openSource.contribute.types.features.description',
    actionKey: 'openSource.contribute.types.features.action',
  },
]
</script>

<template>
  <SectionContainer :id="props.id" paddingY="large">
    <VContainer>
      <!-- Hero Section -->
      <VRow>
        <VCol cols="12" class="text-center mb-8">
          <VIcon :icon="mdiGithub" size="64" color="primary" class="mb-4" />
          <h2 class="text-h3 font-weight-bold mb-4">{{ t('nav.openSource') }}</h2>
          <p
            class="text-h6 text-medium-emphasis max-width-600 mx-auto"
            style="white-space: normal; word-wrap: break-word"
          >
            {{ t('openSource.subtitle') }}
          </p>
        </VCol>
      </VRow>

      <!-- GitHub Stats Section -->
      <VRow class="mb-8">
        <VCol cols="12" class="text-center">
          <VCard elevation="2" rounded="lg" class="mx-auto" max-width="600">
            <VCardItem class="pa-6">
              <div class="d-flex justify-center align-center flex-wrap gap-6">
                <div class="text-center">
                  <div class="d-flex align-center justify-center mb-2">
                    <VIcon :icon="mdiStar" color="warning" class="mr-1" />
                    <span class="text-h5 font-weight-bold">{{
                      t('openSource.github.starUs')
                    }}</span>
                  </div>
                  <p class="text-caption text-medium-emphasis">
                    {{ t('openSource.github.starUsDescription') }}
                  </p>
                </div>

                <VDivider vertical class="d-none d-sm-block" />

                <div class="text-center">
                  <div class="d-flex align-center justify-center mb-2">
                    <VIcon :icon="mdiGithub" color="primary" class="mr-1" />
                    <span class="text-h5 font-weight-bold">{{
                      t('openSource.github.viewSource')
                    }}</span>
                  </div>
                  <p class="text-caption text-medium-emphasis">
                    {{ t('openSource.github.viewSourceDescription') }}
                  </p>
                </div>
              </div>

              <VBtn
                color="primary"
                size="large"
                rounded="pill"
                :prepend-icon="mdiGithub"
                :append-icon="mdiArrowRight"
                class="mt-6"
                href="https://github.com/nedaadevs/nedaa"
                target="_blank"
                elevation="2"
              >
                {{ t('openSource.github.viewOnGithub') }}
              </VBtn>
            </VCardItem>
          </VCard>
        </VCol>
      </VRow>

      <!-- Open Source Features -->
      <VRow class="mb-8">
        <VCol
          v-for="feature in openSourceFeatures"
          :key="feature.titleKey"
          cols="12"
          sm="6"
          lg="4"
          class="mb-4"
        >
          <VCard
            class="h-100 text-center theme-transition hover-feature"
            elevation="1"
            rounded="lg"
          >
            <VCardItem class="pa-4">
              <div class="mb-3">
                <VIcon :icon="feature.icon" size="40" color="primary" />
              </div>
              <VCardTitle class="text-body-1 font-weight-bold mb-2">
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

      <!-- Contribution Section -->
      <VRow>
        <VCol cols="12" class="text-center mb-6">
          <h3 class="text-h4 font-weight-bold mb-4">{{ t('openSource.contribute.title') }}</h3>
          <p
            class="text-body-1 text-medium-emphasis max-width-600 mx-auto"
            style="white-space: normal; word-wrap: break-word"
          >
            {{ t('openSource.contribute.subtitle') }}
          </p>
        </VCol>
      </VRow>

      <VRow>
        <VCol
          v-for="contribution in contributionTypes"
          :key="contribution.titleKey"
          cols="12"
          md="6"
          class="mb-4"
        >
          <VCard class="h-100 theme-transition hover-card" elevation="2" rounded="lg">
            <VCardItem class="pa-6">
              <VCardTitle class="text-h6 font-weight-bold mb-3">
                {{ t(contribution.titleKey) }}
              </VCardTitle>
              <VCardText
                class="text-body-2 text-medium-emphasis mb-4"
                style="white-space: normal; word-wrap: break-word"
              >
                {{ t(contribution.descriptionKey) }}
              </VCardText>
              <VBtn color="primary" variant="tonal" rounded="pill" :append-icon="mdiArrowRight">
                {{ t(contribution.actionKey) }}
              </VBtn>
            </VCardItem>
          </VCard>
        </VCol>
      </VRow>

      <!-- License Section -->
      <VRow class="mt-8">
        <VCol cols="12" class="text-center">
          <VDivider class="my-6" />
          <p
            class="text-body-2 text-medium-emphasis"
            style="white-space: normal; word-wrap: break-word"
            v-html="t('openSource.license')"
          ></p>
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
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12) !important;
}

.hover-feature {
  transition: transform 0.2s ease-in-out;
}

.hover-feature:hover {
  transform: translateY(-2px);
}

.max-width-600 {
  max-width: 600px;
}

.gap-6 {
  gap: 1.5rem;
}
</style>
