<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'

// Components
import PageContainer from '@/components/layout/PageContainer.vue'

// Stores
import { useAppStore } from '@/stores/app'

// Enums
import { AppLocale } from '@/enums/app'

const route = useRoute()

const { t } = useI18n()
const { setLocale } = useAppStore()

// Check for lang query parameter and set locale if valid
onMounted(() => {
  const langParam = route.query.lang as string
  if (langParam && Object.values(AppLocale).includes(langParam as AppLocale)) {
    setLocale(langParam)
  }
})
</script>

<template>
  <div>
    <PageContainer>
      <div class="text-h3 mb-6">{{ t('privacy.title') }}</div>

      <div class="privacy-policy-content">
        <section class="mb-8">
          <h2 class="text-h5 mb-4">{{ t('privacy.introduction.title') }}</h2>
          <p>{{ t('privacy.introduction.content') }}</p>
        </section>

        <section class="mb-8">
          <h2 class="text-h5 mb-4">{{ t('privacy.logFiles.title') }}</h2>
          <p>{{ t('privacy.logFiles.content') }}</p>
        </section>

        <section class="mb-8">
          <h2 class="text-h5 mb-4">{{ t('privacy.consent.title') }}</h2>
          <p>{{ t('privacy.consent.content') }}</p>
        </section>

        <section class="mb-8">
          <h2 class="text-h5 mb-4">{{ t('privacy.contact.title') }}</h2>
          <p>{{ t('privacy.contact.content') }}</p>
        </section>

        <section class="mt-10">
          <p class="text-caption text-medium-emphasis">{{ t('privacy.effectiveDate') }}</p>
        </section>
      </div>
    </PageContainer>
  </div>
</template>

<style scoped>
.privacy-policy-content {
  max-width: 800px;
}
</style>
