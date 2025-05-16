<script setup lang="ts">
import { storeToRefs } from 'pinia'

import { useAppStore } from '@/stores/app'

import { mdiWeatherNight, mdiWeatherSunny } from '@mdi/js'

const { toggleTheme } = useAppStore()

const { theme } = storeToRefs(useAppStore())
</script>

<template>
  <VBtn icon variant="text" @click="toggleTheme">
    <VIcon :icon="theme === 'light' ? mdiWeatherNight : mdiWeatherSunny" />
  </VBtn>
</template>
