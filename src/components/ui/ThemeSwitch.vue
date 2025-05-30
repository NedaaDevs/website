<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useAppStore } from '@/stores/app'

import { mdiWeatherNight, mdiWeatherSunny } from '@mdi/js'

const { t } = useI18n()
const { toggleTheme } = useAppStore()
const { theme } = storeToRefs(useAppStore())

const tooltipText = computed(() => {
  return theme.value === 'light' ? t('common.switchToDarkTheme') : t('common.switchToLightTheme')
})

const iconColor = computed(() => {
  return theme.value === 'light' ? 'primary' : 'primary-lighten-2'
})
</script>

<template>
  <VTooltip
    class="border text-secondary"
    :text="tooltipText"
    location="bottom"
    min-width="120"
    :z-index="1000"
    content-class="rounded-lg pa-3 bg-info"
    elevation="4"
    :offset="10"
    transition="scale-transition"
    open-delay="100"
  >
    <template v-slot:activator="{ props }">
      <VBtn
        icon
        variant="text"
        @click="toggleTheme"
        v-bind="props"
        class="hover-feedback"
        :color="iconColor"
      >
        <div class="icon-container">
          <VIcon
            v-if="theme === 'light'"
            :icon="mdiWeatherNight"
            class="theme-icon theme-enter-active"
          />
          <VIcon v-else :icon="mdiWeatherSunny" class="theme-icon theme-enter-active" />
        </div>
      </VBtn>
    </template>
  </VTooltip>
</template>

<style scoped>
.theme-switch-btn {
  transform: translate(0);
  transition: transform 0.2s ease;
}

.theme-switch-btn:hover {
  transform: scale(1.05);
}

.icon-container {
  position: relative;
  width: 24px;
  height: 24px;
}

.theme-icon {
  position: absolute;
  top: 0;
  left: 0;
}

.theme-enter-active {
  animation: theme-icon-rotate 0.5s;
}

@keyframes theme-icon-rotate {
  0% {
    transform: rotate(-90deg) scale(0.5);
    opacity: 0;
  }
  100% {
    transform: rotate(0) scale(1);
    opacity: 1;
  }
}
</style>
