<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { mdiTranslate, mdiCheck } from '@mdi/js'

import { useAppStore } from '@/stores/app'

const { setLocale } = useAppStore()

const { locale } = storeToRefs(useAppStore())

const languages = [
  { code: 'en', name: 'English' },
  { code: 'ar', name: 'العربية' },
  { code: 'ms', name: 'Bahasa Melayu' },
]
</script>

<template>
  <VMenu transition="slide-y-transition">
    <template v-slot:activator="{ props }">
      <VBtn icon variant="text" v-bind="props">
        <VIcon :icon="mdiTranslate" />
      </VBtn>
    </template>

    <VList width="200">
      <VListItem
        v-for="language in languages"
        :key="language.code"
        :value="language.code"
        @click="setLocale(language.code)"
      >
        <VListItemTitle>{{ language.name }}</VListItemTitle>
        <template v-slot:append>
          <VIcon v-if="locale === language.code" color="primary" :icon="mdiCheck" size="small" />
        </template>
      </VListItem>
    </VList>
  </VMenu>
</template>
