<script setup lang="ts">
// Icons
import { mdiChevronDown } from '@mdi/js'

type Props = {
  id?: string
  background?: 'default' | 'primary' | 'surface' | 'gradient'
  paddingY?: 'small' | 'medium' | 'large' | 'none'
  fullHeight?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  background: 'default',
  paddingY: 'medium',
  fullHeight: false,
})

const scrollToNext = () => {
  const section = document.getElementById(props.id || '')
  if (section) {
    const nextSection = section.nextElementSibling
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<template>
  <section
    :id="id"
    :class="[
      background === 'default'
        ? ''
        : background === 'primary'
          ? 'bg-primary text-white'
          : background === 'surface'
            ? 'bg-surface'
            : 'gradient-background',
      fullHeight ? 'full-height d-flex align-center' : '',
      paddingY === 'none'
        ? 'py-0'
        : paddingY === 'small'
          ? 'py-4'
          : paddingY === 'medium'
            ? 'py-8'
            : 'py-16',
      'position-relative w-100',
    ]"
  >
    <slot />

    <!-- Down Arrow for Full Height Sections -->
    <div v-if="fullHeight" class="scroll-indicator">
      <VBtn icon variant="text" color="white" size="large" @click="scrollToNext">
        <VIcon :icon="mdiChevronDown" />
      </VBtn>
    </div>
  </section>
</template>

<style scoped>
.full-height {
  min-height: 100vh;
}

.gradient-background {
  background: linear-gradient(
    135deg,
    rgb(var(--v-theme-primary-lighten-1)) 0%,
    rgb(var(--v-theme-primary)) 100%
  );
  color: rgb(var(--v-theme-on-primary));
}

.scroll-indicator {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateX(-50%) translateY(0);
  }
  40% {
    transform: translateX(-50%) translateY(-10px);
  }
  60% {
    transform: translateX(-50%) translateY(-5px);
  }
}
</style>
