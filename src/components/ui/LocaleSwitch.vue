<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

// Icons
import { mdiTranslate, mdiCheck } from '@mdi/js'

// Stores
import { useAppStore } from '@/stores/app'

// Enums
import { AppLocale } from '@/enums/app'

const appStore = useAppStore()
const { setLocale } = appStore
const { locale } = storeToRefs(appStore)
const { t } = useI18n()

type LanguageItem = {
  id: AppLocale
  name: string
  nativeName: string
}

const languages = computed<LanguageItem[]>(() => {
  return Object.values(AppLocale).map((localeCode) => {
    return {
      id: localeCode,
      name: t(`languages.${localeCode}.name`),
      nativeName: t(`languages.${localeCode}.nativeName`),
    }
  })
})

// Get current language
const currentLanguage = computed(() => {
  return languages.value.find((lang) => lang.id === locale.value)
})
</script>

<template>
  <VMenu transition="slide-y-transition">
    <template v-slot:activator="{ props }">
      <VBtn
        icon
        variant="text"
        v-bind="props"
        :title="t('languages.currentLanguage') + ': ' + currentLanguage?.name"
      >
        <VIcon :icon="mdiTranslate" />
      </VBtn>
    </template>

    <VList width="220">
      <VListSubheader>{{ t('languages.selectLanguage') }}</VListSubheader>

      <VListItem
        v-for="language in languages"
        :key="language.id"
        :value="language.id"
        @click="setLocale(language.id)"
      >
        <template v-slot:prepend>
          <VIcon
            v-if="locale === language.id"
            color="primary"
            :icon="mdiCheck"
            size="small"
            class="mr-2"
          />
        </template>

        <VListItemTitle class="d-flex justify-space-between">
          <span>{{ language.name }}</span>
          <span class="text-caption text-disabled">
            {{ language.nativeName }}
          </span>
        </VListItemTitle>
      </VListItem>
    </VList>
  </VMenu>
</template>
