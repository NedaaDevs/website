<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// Components
import SectionContainer from '@/components/sections/SectionContainer.vue'

// Icons
import { mdiGithub, mdiHeart, mdiAccountGroup, mdiEye, mdiArrowRight } from '@mdi/js'

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
    href: 'https://github.com/nedaadevs/nedaa/issues',
  },
  {
    titleKey: 'openSource.contribute.types.translate.title',
    descriptionKey: 'openSource.contribute.types.translate.description',
    actionKey: 'openSource.contribute.types.translate.action',
    href: 'https://crowdin.com/project/nedaa',
  },
  {
    titleKey: 'openSource.contribute.types.bugs.title',
    descriptionKey: 'openSource.contribute.types.bugs.description',
    actionKey: 'openSource.contribute.types.bugs.action',
    href: 'https://github.com/nedaadevs/nedaa/issues/new?template=bug_report.md',
  },
  {
    titleKey: 'openSource.contribute.types.features.title',
    descriptionKey: 'openSource.contribute.types.features.description',
    actionKey: 'openSource.contribute.types.features.action',
    href: 'https://github.com/nedaadevs/nedaa/issues/new?template=feature_request.md',
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
          <h2 class="text-h4 font-weight-bold mb-4">{{ t('nav.openSource') }}</h2>
          <p
            class="text-h6 text-medium-emphasis max-width-600 mx-auto mb-6"
            style="white-space: normal; word-wrap: break-word"
          >
            {{ t('openSource.subtitle') }}
          </p>
          <VBtn
            color="primary"
            size="large"
            rounded="pill"
            :prepend-icon="mdiGithub"
            :append-icon="mdiArrowRight"
            href="https://github.com/nedaadevs/nedaa"
            target="_blank"
            elevation="2"
          >
            {{ t('openSource.github.viewOnGithub') }}
          </VBtn>
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
            class="h-100 text-center theme-transition hover-card--subtle"
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
          <h3 class="text-h5 font-weight-bold mb-4">{{ t('openSource.contribute.title') }}</h3>
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
              <VBtn
                color="primary"
                variant="tonal"
                rounded="pill"
                :append-icon="mdiArrowRight"
                :href="contribution.href"
                target="_blank"
              >
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
