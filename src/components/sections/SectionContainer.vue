<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
// Icons
import { mdiChevronDown, mdiChevronUp } from '@mdi/js'

type Props = {
  id?: string
  background?: 'default' | 'primary' | 'surface' | 'gradient'
  paddingY?: 'small' | 'medium' | 'large' | 'none'
  fullHeight?: boolean
  showArrowImmediately?: boolean
  hideArrowOnScroll?: boolean
  showUpArrow?: boolean
  upArrowTarget?: string // ID of the target section to scroll to
  hideUpArrowOnScroll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  background: 'default',
  paddingY: 'medium',
  fullHeight: false,
  showArrowImmediately: true,
  hideArrowOnScroll: false,
  showUpArrow: false,
  upArrowTarget: undefined,
  hideUpArrowOnScroll: false,
})

const showArrow = ref(props.showArrowImmediately)
const showUpArrow = ref(props.showUpArrow)
const scrollToNext = () => {
  const section = document.getElementById(props.id || '')
  if (section) {
    const nextSection = section.nextElementSibling
    if (nextSection) {
      // Get the header height to account for fixed headers (if any)
      const headerHeight = document.querySelector('header')?.offsetHeight || 0

      // Calculate position with offset for the header
      const offsetPosition =
        nextSection.getBoundingClientRect().top + window.pageYOffset - headerHeight

      // Smooth scroll to the position
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
    }
  }
}

const scrollToTarget = () => {
  if (!props.upArrowTarget) return

  const targetSection = document.getElementById(props.upArrowTarget)
  if (targetSection) {
    // Get the header height to account for fixed headers (if any)
    const headerHeight = document.querySelector('header')?.offsetHeight || 0

    // Calculate position with offset for the header
    const offsetPosition =
      targetSection.getBoundingClientRect().top + window.pageYOffset - headerHeight

    // Smooth scroll to the position
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    })
  }
}

const handleScroll = () => {
  // Handle down arrow visibility
  if (props.hideArrowOnScroll) {
    // Show arrow only at the top of the page
    if (window.scrollY < 100) {
      showArrow.value = true
    } else {
      showArrow.value = false
    }
  }

  // Handle up arrow visibility
  if (props.hideUpArrowOnScroll) {
    // Show up arrow only when scrolled down
    if (window.scrollY > 100) {
      showUpArrow.value = true
    } else {
      showUpArrow.value = false
    }
  }
}

onMounted(() => {
  if (props.hideArrowOnScroll || props.hideUpArrowOnScroll) {
    window.addEventListener('scroll', handleScroll)
    // Initial check
    handleScroll()
  }
})

onUnmounted(() => {
  if (props.hideArrowOnScroll || props.hideUpArrowOnScroll) {
    window.removeEventListener('scroll', handleScroll)
  }
})
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
      fullHeight ? 'full-height' : '',
      paddingY === 'none'
        ? 'py-0'
        : paddingY === 'small'
          ? 'py-4'
          : paddingY === 'medium'
            ? 'py-8'
            : 'py-16',
      'position-relative w-100 theme-transition',
    ]"
  >
    <slot />

    <!-- Down Arrow for Full Height Sections -->
    <div v-if="fullHeight && showArrow" class="scroll-indicator scroll-down">
      <VBtn
        icon
        variant="text"
        :color="background === 'default' ? 'primary' : 'on-primary'"
        size="large"
        @click="scrollToNext"
        class="scroll-button hover-feedback rounded-circle pa-3"
        elevation="1"
      >
        <VIcon :icon="mdiChevronDown" size="large" />
      </VBtn>
    </div>

    <!-- Up Arrow -->
    <div v-if="showUpArrow" class="scroll-indicator scroll-up">
      <VBtn
        icon
        variant="text"
        :color="background === 'default' ? 'primary' : 'on-primary'"
        size="large"
        @click="scrollToTarget"
        class="scroll-button hover-feedback rounded-circle pa-3"
        elevation="1"
      >
        <VIcon :icon="mdiChevronUp" size="large" />
      </VBtn>
    </div>
  </section>
</template>

<style scoped>
.gradient-background {
  background: linear-gradient(
    135deg,
    var(--v-theme-primary-lighten-1, var(--v-theme-primary)) 0%,
    var(--v-theme-primary) 100%
  );
  color: var(--v-theme-on-primary);
}

.full-height {
  min-height: 100vh;
  display: flex;
  align-items: center;
  width: 100%;
}

.scroll-indicator {
  position: fixed;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  opacity: 1;
  transition: opacity 0.3s ease;

  z-index: 5;
  animation: bounce 2.5s 3;
}

.scroll-up {
  top: 1rem;
}

/* When both arrows are visible, adjust positioning */
.scroll-down {
  bottom: 2rem;
}

.scroll-button {
  position: relative;
  background-color: rgba(var(--v-theme-surface), 0.85);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  width: 56px !important;
  height: 56px !important;
  transition:
    transform 0.2s ease,
    background-color 0.3s ease,
    box-shadow 0.3s ease;
  /* pointer-events: auto; */
}

.scroll-button:hover {
  transform: translateY(-3px);
  background-color: rgba(var(--v-theme-surface), 0.95);
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
    transform: translateX(-50%) translateY(-12px);
  }
  60% {
    transform: translateX(-50%) translateY(-6px);
  }
}

/* Media query for responsive positioning */
@media (max-width: 600px) {
  .scroll-indicator.scroll-down {
    bottom: 1.5rem !important;
  }

  .scroll-indicator.scroll-up {
    top: 1.5rem !important;
  }

  .scroll-button {
    width: 48px !important;
    height: 48px !important;
    padding: 8px !important;
  }
}
</style>
